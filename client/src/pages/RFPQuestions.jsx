import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Pencil, Save, X, Download } from "lucide-react";
import * as XLSX from "xlsx";

import api from "../utilities/api";

import Header from "../components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading1.json";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const RFPQuestions = () => {
  const { rfpId } = useParams();
  const [rfp, setRFP] = useState();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // First get the RFP data
        const rfpResponse = await api.get(`rfp/${rfpId}`);
        const rfpData = rfpResponse.data;
        setRFP(rfpData);

        // Then use the RFP data to generate questions
        const questionsResponse = await api.post(`watsonx/generateQuestions`, {
          rfpId: rfpData.id,
          description: rfpData.description,
          open_date: rfpData.open_date,
          close_date: rfpData.close_date,
          budget: rfpData.budget,
        });
        // const questionsResponse = await api.get(`rfpQuestion/rfp/${rfpId}`);
        // console.log(questionsResponse.data);

        setQuestions(questionsResponse.data.questions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [rfpId]);

  const handleEdit = (question) => {
    setEditingId(question.id);
    setEditText(question.description);
  };

  const handleSave = async (questionId) => {
    try {
      await api.put(`rfpQuestion/${questionId}`, {
        description: editText,
      });

      // Update the questions state with the edited text
      setQuestions(
        questions.map((q) =>
          q.id === questionId ? { ...q, description: editText } : q
        )
      );

      setEditingId(null);
      setEditText("");
    } catch (error) {
      console.error("Failed to update question:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleDelete = async (questionId) => {
    try {
      await api.delete(`rfpQuestion/${questionId}`);
      // Remove the question from state
      setQuestions(questions.filter((q) => q.id !== questionId));
    } catch (error) {
      console.error("Failed to delete question:", error);
    }
  };

  const handleDownloadExcel = () => {
    // Prepare the data for Excel
    const excelData = questions.map((question) => ({
      "Question ID": question.id,
      Question: question.description,
      Complies: "Yes/No", // Default value
      Response: "", // Empty response column
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set dropdown for Complies column
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      const compliesCell = XLSX.utils.encode_cell({ r: R, c: 2 }); // Column C
      ws[compliesCell].dataValidation = {
        type: "list",
        formula1: '"Yes,No"',
        showDropDown: true,
      };
    }

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Questions");

    // Generate Excel file
    XLSX.writeFile(wb, `RFP_Questions_${rfpId}.xlsx`);
  };

  return (
    <div className="bg-zinc-900 text-zinc-100 min-h-screen">
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="flex justify-center">
            <Lottie
              animationData={loadingAnimation}
              loop={true}
              style={{ width: 300, height: 300 }}
            />
          </div>
        </div>
      ) : null}
      <Header />
      <div className="max-w-7xl mx-auto flex flex-col">
        <div className="flex justify-end items-center p-4">
          <Button
            onClick={handleDownloadExcel}
            variant="outline"
            className="flex text-slate-500 items-center gap-2 border-zinc-700 hover:text-zinc-100"
          >
            <Download className="h-4 w-4" />
            Download Excel Template
          </Button>
        </div>
        <div className="grid gap-4 p-4">
          {questions?.map((question) => (
            <Card
              key={question.id}
              className="p-4 hover:shadow-lg transition-shadow bg-zinc-800 border-zinc-700"
            >
              <CardContent className="p-2">
                {editingId === question.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full min-h-[100px] bg-zinc-900 border-zinc-700 text-zinc-100"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel()}
                        className="border-zinc-700 text-zinc-300 hover:text-zinc-100"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={() => handleSave(question.id)}>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-zinc-100">{question.description}</p>
                      <p className="text-xs text-zinc-400">ID: {question.id}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(question.id)}
                        className="text-zinc-400 hover:text-zinc-100"
                      >
                        🗑️
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(question)}
                        className="text-zinc-400 hover:text-zinc-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RFPQuestions;
