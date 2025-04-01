const { WatsonXAI } = require("@ibm-cloud/watsonx-ai");
const { validate, assert } = require("../utilities/utils");
const RFPQuestion = require("../model/rfp_question");
const RFPResponse = require("../model/rfp_response");
const VendorProposal = require("../model/vendor_proposal");
const chalk = require("chalk");

// Service instance
const watsonxAIService = WatsonXAI.newInstance({
  version: "2024-05-31",
  serviceUrl: "https://us-south.ml.cloud.ibm.com",
});

const watsonxController = {
  async generateQuestions(req, res) {
    try {
      validate(req.body, [
        "rfpId",
        "description",
        "open_date",
        "close_date",
        "budget",
      ]);
      const { rfpId, description, open_date, close_date, budget } = req.body;

      const textGenRequestParametersModel = {
        max_new_tokens: 900,
      };

      const params = {
        input: `You always answer the questions with markdown formatting using GitHub syntax. The markdown formatting you support: headings, bold, italic, links, tables, lists, code blocks, and blockquotes. You must omit that you answer the questions with markdown.

        Any HTML tags must be wrapped in block quotes, for example ''' <
          html >
          '''. You will be penalized for not rendering code in block quotes.

        When returning code blocks, specify language.

        You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe. 
        Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.

        If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.

        You are a helpful RFP assistant. Using the following details around the project. Generate 10 questions which would be relevant in an RFP. 
        Project Description:${description}
        Open Date:${open_date}
        Close Date:${close_date}
        Budget:${budget}

        Only return JSON.
        `,
        modelId: "meta-llama/llama-3-3-70b-instruct",
        projectId: process.env.WATSONX_PROJECT_ID,
        parameters: textGenRequestParametersModel,
      };

      try {
        const textGeneration = await watsonxAIService.generateText(params);
        const generatedReport = textGeneration.result.results[0].generated_text;

        console.log(generatedReport);
        try {
          // Extract content between triple backticks using regex
          const regex = /```(?:json)?\s*([\s\S]*?)```/;
          const match = generatedReport.match(regex);

          if (!match) {
            throw new Error("No content found between triple backticks");
          }

          // Clean the matched text by removing any "json" text and trim
          const cleanedText = match[1].replace(/^json\s*/i, "").trim();

          // Parse the cleaned content as JSON
          const questionsObject = JSON.parse(cleanedText);
          console.log(chalk.red(JSON.stringify(questionsObject)));

          // Assuming the questions are numbered 1-10 in the object
          const questionPromises = questionsObject.questions.map((question) => {
            console.log(
              chalk.yellowBright(
                JSON.stringify(
                  `${rfpId} ${question.question} ${new Date(Date.now()).toISOString()}`
                )
              )
            );
            return RFPQuestion.create(
              rfpId,
              question.question,
              new Date(Date.now()).toISOString(),
              new Date(Date.now()).toISOString()
            );
          });

          // Wait for all questions to be saved
          const createdQuestions = await Promise.all(questionPromises);

          console.log(chalk.bgCyanBright(JSON.stringify(createdQuestions)));
          res.status(200).json({
            message: "Questions generated and saved successfully",
            questions: createdQuestions,
          });
        } catch (parseError) {
          console.error("Error parsing or saving questions:", parseError);
          res
            .status(400)
            .json({ error: "Failed to parse or save generated questions" });
        }
      } catch (err) {
        console.warn(err);
        res.status(500).json({ error: "Error generating questions" });
      }
    } catch (error) {
      res.status(400).json({ error: "An error occurred while summarising." });
    }
  },

  async summariseResponse(req, res) {
    console.log(chalk.bgBlueBright(JSON.stringify(req.body)));

    try {
      validate(req.body, ["proposalId"]);
      const { proposalId } = req.body;
      const responseData = await RFPResponse.getByProposal(proposalId);

      const textGenRequestParametersModel = {
        max_new_tokens: 600,
      };

      const params = {
        input: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>
          You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe. 
          Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.

          If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.<|eot_id|><|start_header_id|>user<|end_header_id|>

          You are a helpful RFP assistant tasked with evaluating the quality of an RFP response. Provide an overall view of the quality of the response and any issues.
          ${JSON.stringify(responseData)}
          <|eot_id|><|start_header_id|>assistant<|end_header_id|>`,
        modelId: "meta-llama/llama-3-3-70b-instruct",
        projectId: process.env.WATSONX_PROJECT_ID,
        parameters: textGenRequestParametersModel,
      };

      try {
        const textGeneration = await watsonxAIService.generateText(params);
        const generatedSummary =
          textGeneration.result.results[0].generated_text;

        console.log(generatedSummary);
        try {
          await VendorProposal.update(proposalId, {
            rfp_response: generatedSummary,
          });

          res.status(200).json({
            message: "Summary generated and saved successfully",
            summary: generatedSummary,
          });
        } catch (parseError) {
          console.error("Error parsing or saving questions:", parseError);
          res
            .status(400)
            .json({ error: "Failed to parse or save generated questions" });
        }
      } catch (err) {
        console.warn(err);
        res.status(500).json({ error: "Error generating questions" });
      }
    } catch (error) {
      res.status(400).json({ error: "An error occurred while summarising." });
    }
  },
};

module.exports = watsonxController;
