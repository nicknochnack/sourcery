import { useState, useEffect } from "react";
import api from "../utilities/api";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import Header from "../components/Header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [rfps, setRFPs] = useState([]);
  const [newRFP, setNewRFP] = useState({
    description: "",
    open_date: new Date(Date.now()).toISOString().split("T")[0],
    close_date: new Date(Date.now()).toISOString().split("T")[0],
    budget: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRFPs = async () => {
      try {
        const response = await api.get("/rfp");
        setRFPs(response.data);
      } catch (err) {
        console.error("Failed to fetch RFPs:", err);
      }
    };

    fetchRFPs();
  }, []);

  const handleCreateRFP = async (e) => {
    e.preventDefault();
    setShowDialog(true);
  };

  const handleSubmitRFP = async () => {
    try {
      const res = await api.post("/rfp", {
        description: newRFP.description,
        open_date: newRFP.open_date,
        close_date: newRFP.close_date,
        budget: Number(newRFP.budget),
      });
      setNewRFP({
        description: "",
        open_date: new Date(Date.now()).toISOString().split("T")[0],
        close_date: new Date(Date.now()).toISOString().split("T")[0],
        budget: 0,
      });
      setShowDialog(false);

      navigate(`/questions/${res.data.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRFPClick = (rfpId) => {
    navigate(`/detail/${rfpId}`);
  };

  return (
    <div className="bg-zinc-900 text-zinc-100 min-h-screen">
      <Header />
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-zinc-800 border-zinc-700">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">
              Complete RFP Details
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Please fill in all the required information for your RFP.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dialog-description" className="text-zinc-200">
                Description
              </Label>
              <Textarea
                id="dialog-description"
                value={newRFP.description}
                onChange={(e) =>
                  setNewRFP((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="min-h-[100px] bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="open-date" className="text-zinc-200">
                Open Date
              </Label>
              <Input
                id="open-date"
                type="date"
                value={newRFP.open_date}
                onChange={(e) =>
                  setNewRFP((prev) => ({ ...prev, open_date: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="close-date" className="text-zinc-200">
                Close Date
              </Label>
              <Input
                id="close-date"
                type="date"
                value={newRFP.close_date}
                onChange={(e) =>
                  setNewRFP((prev) => ({ ...prev, close_date: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-zinc-200">
                Budget
              </Label>
              <Input
                id="budget"
                type="number"
                value={newRFP.budget}
                onChange={(e) =>
                  setNewRFP((prev) => ({ ...prev, budget: e.target.value }))
                }
              />
            </div>
            <Button
              onClick={handleSubmitRFP}
              className="text-zinc-50 bg-primary hover:bg-primary/80"
            >
              Submit RFP
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto flex flex-col h-screen">
        {loading ? (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-zinc-100 text-2xl font-extrabold">
              Logging in!
            </div>
          </div>
        ) : null}

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="text-3xl text-zinc-100">Start a new RFP</div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-200">
                RFP Description
              </Label>
              <Textarea
                id="description"
                value={newRFP.description}
                onChange={(e) =>
                  setNewRFP((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter RFP description"
                className="min-h-[100px] bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
            <Button
              className="mt-2 text-zinc-100 bg-primary hover:bg-primary/80"
              onClick={handleCreateRFP}
            >
              Create RFP
            </Button>
          </div>

          <div className="space-y-4">
            <div className="text-3xl text-zinc-100">Existing RFPs</div>
            <div className="border border-zinc-700 rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-700">
                    <TableHead className="text-zinc-300">RFP ID</TableHead>
                    <TableHead className="text-zinc-300">Description</TableHead>
                    <TableHead className="text-zinc-300">Open Date</TableHead>
                    <TableHead className="text-zinc-300">Close Date</TableHead>
                    <TableHead className="text-zinc-300">Budget</TableHead>
                    <TableHead className="text-zinc-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rfps.map((rfp) => (
                    <TableRow
                      key={rfp.id}
                      className="cursor-pointer hover:bg-zinc-800 border-zinc-700"
                      onClick={() => handleRFPClick(rfp.id)}
                    >
                      <TableCell className="text-zinc-100">{rfp.id}</TableCell>
                      <TableCell className="max-w-md truncate text-zinc-100">
                        {rfp.description}
                      </TableCell>
                      <TableCell className="text-zinc-100">
                        {new Date(rfp.open_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-zinc-100">
                        {new Date(rfp.close_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-zinc-100">
                        ${rfp.budget.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            new Date(rfp.close_date) > new Date()
                              ? "bg-green-900 text-green-200"
                              : "bg-red-900 text-red-200"
                          }`}
                        >
                          {new Date(rfp.close_date) > new Date()
                            ? "Open"
                            : "Closed"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
