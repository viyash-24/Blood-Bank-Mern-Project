import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { FiDroplet, FiSend, FiUsers, FiGrid } from "react-icons/fi";
import { getDonorList, getOrgList, createBloodRequest } from "../../services/adminService";
import { toast } from "react-toastify";

const BloodRequestForm = () => {
  const [formData, setFormData] = useState({
    bloodGroup: "",
    quantity: "",
    urgency: "normal",
    requestType: "donor", // 'donor' or 'organisation'
    targetId: "", // specific donor or organisation ID
    message: ""
  });
  const [donors, setDonors] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donorRes, orgRes] = await Promise.allSettled([
          getDonorList(),
          getOrgList()
        ]);
        
        if (donorRes.status === 'fulfilled') {
          setDonors(donorRes.value.data?.donarData || []);
        }
        if (orgRes.status === 'fulfilled') {
          setOrganisations(orgRes.value.data?.orgData || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load donors and organisations");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.bloodGroup || !formData.quantity || !formData.targetId) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        bloodGroup: formData.bloodGroup,
        quantity: parseInt(formData.quantity),
        urgency: formData.urgency,
        message: formData.message,
        [formData.requestType]: formData.targetId
      };

      const response = await createBloodRequest(requestData);
      
      if (response.data?.success) {
        toast.success("Blood request sent successfully!");
        // Reset form
        setFormData({
          bloodGroup: "",
          quantity: "",
          urgency: "normal",
          requestType: "donor",
          targetId: "",
          message: ""
        });
      } else {
        toast.error(response.data?.message || "Failed to send request");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error(error.response?.data?.message || "Failed to send blood request");
    } finally {
      setLoading(false);
    }
  };

  const getTargetOptions = () => {
    if (formData.requestType === "donor") {
      return donors.map(donor => ({
        id: donor._id,
        name: donor.name || donor.email,
        email: donor.email,
        bloodGroup: donor.bloodGroup
      }));
    } else {
      return organisations.map(org => ({
        id: org._id,
        name: org.organisationName || org.email,
        email: org.email
      }));
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-dark-200 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <FiSend className="text-red-600" size={20} />
            </div>
            Request Blood
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">Send blood requests to donors and organisations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Request Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Request Type */}
                <div>
                  <label className="block text-sm font-semibold text-dark-200 mb-2">Request Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, requestType: "donor", targetId: "" }))}
                      className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                        formData.requestType === "donor"
                          ? "border-blood-500 bg-blood-50 text-blood-600"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      <FiUsers size={18} />
                      <span className="font-medium">Individual Donor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, requestType: "organisation", targetId: "" }))}
                      className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                        formData.requestType === "organisation"
                          ? "border-blood-500 bg-blood-50 text-blood-600"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      <FiGrid size={18} />
                      <span className="font-medium">Organisation</span>
                    </button>
                  </div>
                </div>

                {/* Target Selection */}
                <div>
                  <label className="block text-sm font-semibold text-dark-200 mb-2">
                    {formData.requestType === "donor" ? "Select Donor" : "Select Organisation"}
                  </label>
                  {fetchLoading ? (
                    <div className="animate-pulse">
                      <div className="h-12 bg-gray-200 rounded-xl"></div>
                    </div>
                  ) : (
                    <select
                      name="targetId"
                      value={formData.targetId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blood-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select {formData.requestType === "donor" ? "a donor" : "an organisation"}</option>
                      {getTargetOptions().map(option => (
                        <option key={option.id} value={option.id}>
                          {option.name} {option.email && `(${option.email})`} 
                          {option.bloodGroup && ` - Blood: ${option.bloodGroup}`}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-semibold text-dark-200 mb-2">Blood Group Required</label>
                  <div className="grid grid-cols-4 gap-2">
                    {bloodGroups.map(group => (
                      <button
                        key={group}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, bloodGroup: group }))}
                        className={`p-3 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-1 ${
                          formData.bloodGroup === group
                            ? "border-blood-500 bg-blood-50 text-blood-600"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        <FiDroplet size={14} />
                        {group}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-dark-200 mb-2">Quantity (ML)</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter quantity in milliliters"
                    min="100"
                    max="500"
                    step="50"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blood-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Urgency */}
                <div>
                  <label className="block text-sm font-semibold text-dark-200 mb-2">Urgency Level</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, urgency: "normal" }))}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.urgency === "normal"
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      <span className="font-medium">Normal</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, urgency: "urgent" }))}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.urgency === "urgent"
                          ? "border-red-500 bg-red-50 text-red-600"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      <span className="font-medium">Urgent</span>
                    </button>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-dark-200 mb-2">Additional Message (Optional)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Add any additional information about this request..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blood-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !formData.bloodGroup || !formData.quantity || !formData.targetId}
                  className="w-full bg-gradient-to-r from-blood-500 to-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blood-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <FiSend size={18} />
                      Send Blood Request
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Summary Panel */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blood-50 to-red-50 rounded-2xl p-6 border border-blood-100">
              <h3 className="font-bold text-dark-200 mb-4">Request Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-semibold capitalize">{formData.requestType}</span>
                </div>
                {formData.targetId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target:</span>
                    <span className="font-semibold text-sm">
                      {getTargetOptions().find(opt => opt.id === formData.targetId)?.name || 'Selected'}
                    </span>
                  </div>
                )}
                {formData.bloodGroup && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blood Group:</span>
                    <span className="font-bold text-blood-600">{formData.bloodGroup}</span>
                  </div>
                )}
                {formData.quantity && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-semibold">{formData.quantity} ML</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Urgency:</span>
                  <span className={`font-semibold capitalize ${
                    formData.urgency === 'urgent' ? 'text-red-600' : 'text-blue-600'
                  }`}>{formData.urgency}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-bold text-dark-200 mb-2">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Donors:</span>
                  <span className="font-semibold">{donors.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Organisations:</span>
                  <span className="font-semibold">{organisations.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BloodRequestForm;
