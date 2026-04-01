import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import DataTable from "../../components/ui/DataTable";
import API from "../../services/API";
import { FiDroplet, FiClock, FiGift } from "react-icons/fi";

const DonationHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get("/inventory/get-inventory");
        if(data?.success) setHistory(data.inventory);
      } catch (err) { console.log(err); }
    };
    fetch();
  }, []);

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
      header: "Organisation",
      accessor: "organisation",
      render: (row) => <span className="text-gray-600">{row.organisation?.organisationName || "N/A"}</span>,
    },
    {
      header: "Date",
      render: (row) => (
        <span className="flex items-center gap-1.5 text-gray-500">
          <FiClock size={14} /> {new Date(row.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-dark-200 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <FiGift className="text-emerald-600" size={20} />
            </div>
            Donation History
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">Track all your blood donation records</p>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-sm font-medium opacity-80">Total Donations</p>
          <p className="text-4xl font-bold mt-1">{history.length}</p>
          <p className="text-sm opacity-70 mt-1">Total donated: {history.reduce((s, d) => s + d.quantity, 0)} ML</p>
        </div>

        <DataTable columns={columns} data={history} emptyMessage="No donation records found" emptyIcon={FiGift} />
      </div>
    </Layout>
  );
};

export default DonationHistory;
