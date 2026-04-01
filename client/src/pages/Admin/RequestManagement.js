import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import DataTable from "../../components/ui/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";
import ConfirmModal from "../../components/Modal/ConfirmModal";
import StatCard from "../../components/ui/StatCard";
import { FiClipboard, FiDroplet, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { formatDateTime } from "../../utils/helpers";
import { toast } from "react-toastify";
import API from "../../services/API";

const RequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ open: false, request: null, action: null });

  const fetchRequests = async () => {
    try {
      const { data } = await API.get("/request/get-all-requests");
      if(data?.success) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchRequests();
  }, []);
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = activeFilter === "all" ? requests : requests.filter((r) => r.status === activeFilter);

  const stats = {
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const handleAction = async () => {
    const { request, action } = confirmModal;
    try {
      const { data } = await API.put(`/request/update-status/${request._id}`, { status: action });
      if (data?.success) {
         setRequests((prev) => prev.map((r) => r._id === request._id ? { ...r, status: action } : r));
         toast.success(`Request ${action} successfully`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
      console.log(error);
    }
    setConfirmModal({ open: false, request: null, action: null });
  };

  const columns = [
    {
      header: "Hospital",
      render: (row) => <span className="font-semibold text-dark-200">{row.hospitalName}</span>,
      accessor: (row) => row.hospitalName,
    },
    {
      header: "Blood Group",
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-blood-600 bg-blood-50 rounded-lg">
          <FiDroplet size={12} /> {row.bloodGroup}
        </span>
      ),
    },
    {
      header: "Quantity",
      render: (row) => <span className="font-semibold text-dark-200">{row.quantity} <span className="text-gray-400 font-normal">ML</span></span>,
    },
    {
      header: "Urgency",
      render: (row) => (
        <StatusBadge status={row.urgency === "urgent" ? "rejected" : "active"} label={row.urgency === "urgent" ? "Urgent" : "Normal"} />
      ),
    },
    {
      header: "Date",
      render: (row) => <span className="flex items-center gap-1.5 text-gray-500"><FiClock size={14} /> {formatDateTime(row.createdAt)}</span>,
    },
    {
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const filters = [
    { key: "all", label: "All" },
    { key: "pending", label: `Pending (${stats.pending})` },
    { key: "approved", label: `Approved (${stats.approved})` },
    { key: "rejected", label: `Rejected (${stats.rejected})` },
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-dark-200 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <FiClipboard className="text-amber-600" size={20} />
            </div>
            Blood Requests
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">Review and manage hospital blood requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Pending" value={stats.pending} icon={FiClock} color="amber" />
          <StatCard title="Approved" value={stats.approved} icon={FiCheckCircle} color="green" />
          <StatCard title="Rejected" value={stats.rejected} icon={FiXCircle} color="blood" />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl w-fit">
          {filters.map((f) => (
            <button key={f.key} onClick={() => setActiveFilter(f.key)} className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${activeFilter === f.key ? 'bg-white text-dark-200 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Requests Table */}
        <DataTable
          columns={columns}
          data={filtered}
          searchable
          searchPlaceholder="Search requests..."
          emptyMessage="No requests found"
          emptyIcon={FiClipboard}
          actions={(row) =>
            row.status === "pending" ? (
              <>
                <button onClick={() => setConfirmModal({ open: true, request: row, action: "approved" })} className="px-3 py-1.5 text-xs font-semibold text-white bg-success-500 hover:bg-success-600 rounded-lg transition-all" title="Approve">
                  <FiCheckCircle size={14} />
                </button>
                <button onClick={() => setConfirmModal({ open: true, request: row, action: "rejected" })} className="px-3 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all" title="Reject">
                  <FiXCircle size={14} />
                </button>
              </>
            ) : null
          }
        />
      </div>

      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, request: null, action: null })}
        onConfirm={handleAction}
        title={confirmModal.action === "approved" ? "Approve Request" : "Reject Request"}
        message={`Are you sure you want to ${confirmModal.action === "approved" ? "approve" : "reject"} this blood request from ${confirmModal.request?.hospitalName}?`}
        confirmText={confirmModal.action === "approved" ? "Approve" : "Reject"}
        confirmColor={confirmModal.action === "approved" ? "green" : "red"}
      />
    </Layout>
  );
};

export default RequestManagement;
