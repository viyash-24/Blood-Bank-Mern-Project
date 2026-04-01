import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import BloodGroupCard from "../../components/BloodGroupCard";
import DataTable from "../../components/ui/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";
import AlertBanner from "../../components/ui/AlertBanner";
import Modal from "../../components/Modal/Modal";
import { FiDroplet, FiPlus, FiClock, FiAlertTriangle } from "react-icons/fi";
import { getBloodGroupData } from "../../services/inventoryService";
import API from "../../services/API";
import { formatDateTime, getExpiryStatus } from "../../utils/helpers";
import moment from "moment";

const InventoryManagement = () => {
  const [bloodData, setBloodData] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const fetchData = async () => {
    try {
      const [bloodRes, inventoryRes] = await Promise.allSettled([
        getBloodGroupData(),
        API.get("/inventory/get-inventory"),
      ]);
      if (bloodRes.status === "fulfilled") setBloodData(bloodRes.value.data?.bloodGroupData || []);
      if (inventoryRes.status === "fulfilled") setRecords(inventoryRes.value.data?.inventory || []);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const nearExpiryItems = [];
  const expiredItems = [];
  const expiryItems = activeTab === "expired" ? expiredItems : activeTab === "near-expiry" ? nearExpiryItems : [...expiredItems, ...nearExpiryItems];

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
      header: "Type",
      render: (row) => (
        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${row.inventoryType === "in" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${row.inventoryType === "in" ? "bg-green-500" : "bg-red-500"}`} />
          {row.inventoryType === "in" ? "IN" : "OUT"}
        </span>
      ),
    },
    {
      header: "Quantity",
      render: (row) => <span className="font-semibold text-dark-200">{row.quantity} <span className="text-gray-400 font-normal">ML</span></span>,
    },
    { header: "Email", accessor: "email", render: (row) => <span className="text-gray-600">{row.email}</span> },
    {
      header: "Date",
      render: (row) => (
        <span className="flex items-center gap-1.5 text-gray-500"><FiClock size={14} /> {formatDateTime(row.createdAt)}</span>
      ),
    },
  ];

  const expiryColumns = [
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
      header: "Expiry Date",
      render: (row) => <span className="text-gray-500">{moment(row.expiryDate).format("DD MMM YYYY")}</span>,
    },
    {
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-dark-200 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blood-50 flex items-center justify-center">
                <FiDroplet className="text-blood-600" size={20} />
              </div>
              Blood Inventory
            </h1>
            <p className="text-sm text-gray-500 mt-1 ml-[52px]">Manage blood stock and track expiry</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-700 hover:to-blood-600 rounded-xl shadow-lg shadow-blood-600/20 transition-all duration-300 active:scale-[0.98]">
            <FiPlus size={18} /> Add Stock
          </button>
        </div>

        {/* Expiry Alerts */}
        {(nearExpiryItems.length > 0 || expiredItems.length > 0) && (
          <div className="space-y-2">
            {nearExpiryItems.length > 0 && (
              <AlertBanner type="warning" title={`${nearExpiryItems.length} units expiring within 7 days`} message="Review and transfer these units before expiry." />
            )}
            {expiredItems.length > 0 && (
              <AlertBanner type="error" title={`${expiredItems.length} units have expired`} message="These units should be disposed of immediately." />
            )}
          </div>
        )}

        {/* Blood Group Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {bloodData.map((g) => (
            <BloodGroupCard key={g.bloodGroup} bloodGroup={g.bloodGroup} totalIn={g.totalIn} totalOut={g.totalOut} available={g.availabeBlood} expiryWarning={nearExpiryItems.some((e) => e.bloodGroup === g.bloodGroup)} />
          ))}
        </div>

        {/* Expiry Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-dark-200 flex items-center gap-2">
              <FiAlertTriangle className="text-warning-500" size={18} /> Expiry Tracking
            </h2>
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
              {[{ key: "all", label: "All" }, { key: "near-expiry", label: "Near Expiry" }, { key: "expired", label: "Expired" }].map((t) => (
                <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${activeTab === t.key ? 'bg-white text-dark-200 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <DataTable columns={expiryColumns} data={expiryItems} emptyMessage="No expiry concerns" emptyIcon={FiDroplet} />
        </div>

        {/* All Records */}
        <div>
          <h2 className="text-lg font-bold text-dark-200 mb-4">All Records</h2>
          <DataTable columns={columns} data={records} loading={loading} searchable searchPlaceholder="Search by email or blood group..." emptyMessage="No inventory records" emptyIcon={FiDroplet} />
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); fetchData(); }} />
    </Layout>
  );
};

export default InventoryManagement;
