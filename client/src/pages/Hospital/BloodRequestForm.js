import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { FiFileText, FiDroplet, FiSend } from "react-icons/fi";
import { toast } from "react-toastify";
import API from "../../services/API";

const BloodRequestForm = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [quantity, setQuantity] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bloodGroup || !quantity) return toast.error("Please fill all required fields");
    try {
      const { data } = await API.post("/request/create", {
        bloodGroup,
        quantity,
        urgency,
        notes,
      });
      if (data?.success) {
        toast.success(data.message || "Blood request submitted successfully!");
        setBloodGroup(""); setQuantity(""); setUrgency("normal"); setNotes("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error submitting request");
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-dark-200 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-info-50 flex items-center justify-center">
              <FiFileText className="text-info-600" size={20} />
            </div>
            Request Blood
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">Submit a blood request to the admin</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Blood Group */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Blood Group *</label>
              <div className="grid grid-cols-4 gap-2">
                {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((g) => (
                  <button
                    key={g} type="button" onClick={() => setBloodGroup(g)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                      bloodGroup === g ? "border-blood-500 bg-blood-50 text-blood-600 shadow-md" : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <FiDroplet size={14} /> {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Quantity (ML) *</label>
              <input
                type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity in ML"
                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all focus:border-blood-500 focus:ring-2 focus:ring-blood-500/10 focus:bg-white"
              />
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Urgency Level</label>
              <div className="flex gap-3">
                {[{ key: "normal", label: "Normal", color: "border-gray-200 text-gray-600" }, { key: "urgent", label: "Urgent", color: "border-red-200 text-red-600" }].map((u) => (
                  <button
                    key={u.key} type="button" onClick={() => setUrgency(u.key)}
                    className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      urgency === u.key ? (u.key === "urgent" ? "border-red-500 bg-red-50 text-red-700" : "border-info-500 bg-info-50 text-info-700") : `${u.color} hover:border-gray-300`
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Additional Notes</label>
              <textarea
                value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                placeholder="Any additional details..."
                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all focus:border-blood-500 focus:ring-2 focus:ring-blood-500/10 focus:bg-white resize-none"
              />
            </div>

            <button type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-700 hover:to-blood-600 rounded-xl shadow-lg shadow-blood-600/20 transition-all duration-300 active:scale-[0.98]">
              <FiSend size={16} /> Submit Request
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default BloodRequestForm;
