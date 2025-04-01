import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  Users,
  Calendar,
  DollarSign,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import api from "../utilities/api";
import Header from "../components/Header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading2.json";

const RFPResponse = () => {
  const { rfpId } = useParams();
  const navigate = useNavigate();
  const [rfp, setRFP] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [proposalResponses, setProposalResponses] = useState([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [aiSummary, setAISummary] = useState("");
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [selectedProposals, setSelectedProposals] = useState([]);

  useEffect(() => {
    const fetchRFPDetails = async () => {
      setLoading(true);
      try {
        // Fetch RFP details
        const rfpResponse = await api.get(`/rfp/${rfpId}`);
        setRFP(rfpResponse.data);

        const vendors = await api.get(`/vendor/`);
        console.log(vendors);
        setVendors(vendors.data);

        // Fetch RFP responses grouped by vendor proposals
        const responsesData = await api.get(`/vendorProposal/rfp/${rfpId}`);
        setResponses(responsesData.data);
        console.log(responsesData);
      } catch (error) {
        console.error("Failed to fetch RFP details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRFPDetails();
  }, [rfpId]);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedVendor) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("rfpId", rfpId);
    formData.append("vendorId", selectedVendor);

    setUploadLoading(true);
    try {
      await api.post("/rfpResponse/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Refresh responses after upload
      const responsesData = await api.get(`/vendorProposal/rfp/${rfpId}`);
      setResponses(responsesData.data);
      setSelectedFile(null);
      setSelectedVendor(null); // Reset selected vendor
    } catch (error) {
      console.error("Failed to upload response:", error);
    } finally {
      setUploadLoading(false);
    }
  };

  const fetchProposalResponses = async (proposalId) => {
    try {
      console.log(proposalId);
      const responseData = await api.get(`/rfpResponse/rfp/${proposalId}`);
      console.log(responseData);
      setProposalResponses(responseData.data);
    } catch (error) {
      console.error("Failed to fetch proposal responses:", error);
    }
  };

  const handleSummary = async (proposal) => {
    try {
      setIsSummaryLoading(true);
      console.log("Summary kicked off");
      const summaryData = await api.post(`/watsonx/summariseresponse`, {
        proposalId: proposal.id,
      });
      setAISummary(summaryData.data.summary);
      console.log(aiSummary);
    } catch (error) {
      console.error("Failed to summarise proposal:", error);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleViewDetails = async (proposal) => {
    setSelectedProposal(proposal);
    setIsDetailsOpen(true);

    try {
      const responsesData = await fetchProposalResponses(proposal.id);
    } catch (error) {
      console.error("Error fetching response details:", error);
    }
  };

  const handleDelete = async (proposal) => {
    console.log(proposal.id);
    try {
      await api.delete(`/vendorProposal/${proposal.id}`);

      // Refresh the proposals list
      const responsesData = await api.get(`/vendorProposal/rfp/${rfpId}`);
      setResponses(responsesData.data);
      console.log(responsesData);
    } catch (error) {
      console.error("Failed to delete proposal:", error);
    }
  };

  const handleProposalSelect = (proposalId) => {
    setSelectedProposals((prev) => {
      if (prev.includes(proposalId)) {
        return prev.filter((id) => id !== proposalId);
      } else {
        return [...prev, proposalId];
      }
    });
  };

  const handleCompareSelected = async () => {
    if (selectedProposals.length < 2) {
      alert("Please select at least 2 proposals to compare");
      return;
    }

    // alert(JSON.stringify(proposalData));
    navigate(`/compare/${rfpId}`, { state: { selectedProposals } });
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
        {/* RFP Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-zinc-100">RFP Details</CardTitle>
              <CardDescription className="text-zinc-400">
                Request for Proposal Information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-zinc-400" />
                <div>
                  <div className="text-sm font-medium text-zinc-200">
                    Description
                  </div>
                  <div className="text-zinc-400">{rfp?.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-zinc-400" />
                <div>
                  <div className="text-sm font-medium text-zinc-200">
                    Timeline
                  </div>
                  <div className="text-zinc-400">
                    Opens: {new Date(rfp?.open_date).toLocaleDateString()}
                    <br />
                    Closes: {new Date(rfp?.close_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-zinc-400" />
                <div>
                  <div className="text-sm font-medium text-zinc-200">
                    Budget
                  </div>
                  <div className="text-zinc-400">
                    ${rfp?.budget.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-zinc-100">
                Response Statistics
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Overview of submitted responses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-zinc-400" />
                <div>
                  <div className="text-sm font-medium text-zinc-200">
                    Total Responses
                  </div>
                  <div className="text-zinc-400">{responses.length}</div>
                </div>
              </div>
              <div className="text-sm text-zinc-400">
                {new Date(rfp?.close_date) > new Date() ? (
                  <span className="text-green-600">Open for submissions</span>
                ) : (
                  <span className="text-red-600">Submission period closed</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Response Section */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-100">Submit Response</CardTitle>
            <CardDescription className="text-zinc-400">
              Upload your completed RFP response template
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Select
                  onValueChange={setSelectedVendor}
                  value={selectedVendor}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Vendor" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-50">
                    {vendors.map((vendor) => (
                      <SelectItem value={vendor.id}>{vendor.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  disabled={
                    uploadLoading || new Date(rfp?.close_date) < new Date()
                  }
                  className="max-w-md"
                />
                <Button
                  onClick={handleUpload}
                  disabled={
                    !selectedFile ||
                    uploadLoading ||
                    new Date(rfp?.close_date) < new Date()
                  }
                  className="flex items-center gap-2"
                >
                  {uploadLoading ? (
                    "Uploading..."
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
              {selectedFile && (
                <p className="text-sm text-green-600">
                  Selected file: {selectedFile.name}
                </p>
              )}
              <p className="text-sm text-zinc-400">
                Please upload the completed Excel template that you downloaded
                from the RFP Questions page.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Responses List Section */}
        {responses.length > 0 && (
          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-zinc-100">
                Submitted Responses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end mb-4">
                  <Button
                    onClick={handleCompareSelected}
                    disabled={selectedProposals.length < 2}
                    variant="outline"
                    className="text-slate-500"
                  >
                    Compare Selected ({selectedProposals.length})
                  </Button>
                </div>
                {responses.map((response) => (
                  <div
                    key={response.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedProposals.includes(response.id)}
                        onChange={() => handleProposalSelect(response.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <div>
                        <div className="font-medium">
                          {response.name} - Response #{response.id}
                        </div>
                        <div className="text-s bzinc-50-500">
                          Submitted:{" "}
                          {new Date(response.date_created).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="text-slate-500"
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(response)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(response)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Response Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-zinc-800 border-zinc-700 text-zinc-100">
          <DialogHeader className="space-y-4">
            <div className="flex justify-between items-center">
              <DialogTitle>
                Response Details - {selectedProposal?.name}
              </DialogTitle>
              <Button
                onClick={() => handleSummary(selectedProposal)}
                disabled={isSummaryLoading}
                variant="outline"
                className="ml-4 mr-4 text-slate-500"
              >
                {isSummaryLoading ? "" : "Generate AI Summary"}
              </Button>
            </div>
          </DialogHeader>

          {/* Update Summary Section */}
          {(aiSummary || isSummaryLoading) && (
            <div className="">
              <div className="rounded">
                <div className="text-sm whitespace-pre-wrap">
                  {isSummaryLoading ? (
                    <div className="flex justify-center">
                      <Lottie
                        animationData={loadingAnimation}
                        loop={true}
                        style={{ width: 300, height: 300 }}
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg border-purple-500 p-4">
                      {aiSummary.trim()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {proposalResponses.map((response) => (
              <div key={response.id} className="border rounded-lg p-4">
                <div className="font-medium mb-2">{response.description}</div>
                <div className="bg-gray-50 p-3 rounded mb-2">
                  <div className="font-medium text-sm text-gray-600 mb-1">
                    Response:
                  </div>
                  <div className="text-gray-800">{response.response}</div>
                </div>
                <div
                  className={`text-sm ${response.complies ? "text-green-600" : "text-red-600"}`}
                >
                  Complies: {response.complies ? "Yes" : "No"}
                </div>
              </div>
            ))}
            {proposalResponses.length === 0 && (
              <div className="text-center text-gray-500">
                No responses found for this proposal
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RFPResponse;
