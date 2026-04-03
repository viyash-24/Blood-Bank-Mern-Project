import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import DataTable from "../../components/ui/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";
import { FiClipboard, FiDroplet, FiClock } from "react-icons/fi";
import { formatDateTime } from "../../utils/helpers";
import API from "../../services/API";

const RequestStatus = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [data, setData] = useState([]);

  const fetchRequests = async () => {
    try {
      const response = await API.get("/request/get-hospital-requests");
      if(response.data?.success) {
        setData(response.data.requests);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchRequests();
  }, []);

  const filtered = activeFilter === "all" ? data : data.filter((r) => r.status === activeFilter);

  const columns = [
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
      render: (row) => <StatusBadge status={row.urgency === "urgent" ? "rejected" : "active"} label={row.urgency === "urgent" ? "Urgent" : "Normal"} />,
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

  const tabs = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-dark-200 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <FiClipboard className="text-amber-600" size={20} />
            </div>
            My Requests
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">Track the status of your blood requests</p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl w-fit">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setActiveFilter(t.key)} className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${activeFilter === t.key ? 'bg-white text-dark-200 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <DataTable columns={columns} data={filtered} emptyMessage="No requests found" emptyIcon={FiClipboard} />
      </div>
    </Layout>
  );
};

export default RequestStatus;
