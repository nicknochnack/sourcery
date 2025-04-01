import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../utilities/api";
import Header from "../components/Header";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const RFPComparison = () => {
  const { rfpId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState([]);
  const [responses, setResponses] = useState({});
  const selectedProposals = location.state?.selectedProposals || [];

  useEffect(() => {
    const fetchProposalDetails = async () => {
      setLoading(true);
      try {
        // Fetch all selected proposals
        const proposalsData = await Promise.all(
          selectedProposals.map(async (proposalId) => {
            const proposal = await api.get(`/vendorProposal/${proposalId}`);
            const responses = await api.get(`/rfpResponse/rfp/${proposalId}`);
            return {
              ...proposal.data,
              responses: responses.data,
            };
          })
        );
        console.log(proposalsData);
        setProposals(proposalsData);

        // Organize responses by question for easy comparison
        const organizedResponses = {};
        proposalsData.forEach((proposal) => {
          proposal.responses.forEach((response) => {
            if (!organizedResponses[response.description]) {
              organizedResponses[response.description] = [];
            }
            organizedResponses[response.description].push({
              proposalId: proposal.id,
              vendorName: proposal.name,
              response: response.response,
              complies: response.complies,
            });
          });
        });
        setResponses(organizedResponses);
      } catch (error) {
        console.error("Failed to fetch proposal details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedProposals.length > 0) {
      fetchProposalDetails();
    }
  }, [selectedProposals]);

  const handleBack = () => {
    navigate(`/detail/${rfpId}`);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-zinc-50 text-2xl font-extrabold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 text-zinc-100 min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2 border-zinc-700 text-zinc-300 text-slate-500 hover:text-zinc-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to RFP
          </Button>
          <h1 className="text-2xl font-bold text-zinc-100">
            Proposal Comparison
          </h1>
        </div>

        {/* Vendor Overview */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-100">Vendor Overview</CardTitle>
            <CardDescription className="text-zinc-400">
              Comparing {proposals.length} vendor proposals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {proposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="p-4 border border-zinc-700 rounded-lg bg-zinc-900"
                >
                  <h3 className="font-medium text-lg text-zinc-100">
                    {proposal.id}
                  </h3>
                  <p className="text-sm text-zinc-400">
                    Submitted:{" "}
                    {new Date(proposal.date_created).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Response Comparison */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-100">Response Comparison</CardTitle>
            <CardDescription className="text-zinc-400">
              Compare vendor responses side by side
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(responses).map(([question, answers]) => (
                <div key={question} className="border-b border-zinc-700 pb-6">
                  <h3 className="font-medium mb-4 text-zinc-100">{question}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {answers.map((answer) => (
                      <div
                        key={answer.proposalId}
                        className="p-4 border border-zinc-700 rounded-lg bg-zinc-900"
                      >
                        <div className="font-medium mb-2 text-zinc-100">
                          {answer.vendorName}
                        </div>
                        <div className="text-sm text-zinc-300">
                          {answer.response}
                        </div>
                        <div
                          className={`text-sm mt-2 ${
                            answer.complies ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          Complies: {answer.complies ? "Yes" : "No"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RFPComparison;
