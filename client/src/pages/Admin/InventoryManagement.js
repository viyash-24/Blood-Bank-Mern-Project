import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import BloodGroupCard from "../../components/BloodGroupCard";
import DataTable from "../../components/ui/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";
import AlertBanner from "../../components/ui/AlertBanner";
import Modal from "../../components/Modal/Modal";
import { FiDroplet, FiPlus, FiClock, FiAlertTriangle, FiPackage, FiTrendingUp, FiActivity } from "react-icons/fi";
import { getBloodGroupData } from "../../services/inventoryService";
import API from "../../services/API";
import { formatDateTime, getExpiryStatus } from "../../utils/helpers";
import moment from "moment";

const InventoryManagement = () => {
  const [bloodData, setBloodData] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

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

  // Calculate statistics
  const totalBlood = bloodData.reduce((sum, g) => sum + (g.availabeBlood || 0), 0);
  const totalIn = bloodData.reduce((sum, g) => sum + (g.totalIn || 0), 0);
  const totalOut = bloodData.reduce((sum, g) => sum + (g.totalOut || 0), 0);
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-dark-200 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blood-50 flex items-center justify-center">
                <FiDroplet className="text-blood-600" size={20} />
              </div>
              Blood Inventory
            </h1>
            <p className="text-sm text-gray-500 mt-1 ml-[52px]">Manage blood stock levels and expiry tracking</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-700 hover:to-blood-600 rounded-xl shadow-lg shadow-blood-600/20 transition-all duration-300 active:scale-[0.98]">
            <FiPlus size={18} /> Add Stock
          </button>
        </div>

        {/* Critical Alerts */}
        {(nearExpiryItems.length > 0 || expiredItems.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {nearExpiryItems.length > 0 && (
              <AlertBanner type="warning" title={`${nearExpiryItems.length} units expiring soon`} message="Review and transfer these units before expiry." />
            )}
            {expiredItems.length > 0 && (
              <AlertBanner type="error" title={`${expiredItems.length} expired units`} message="These units should be disposed of immediately." />
            )}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Blood</p>
                <p className="text-2xl font-bold text-dark-200 mt-1">{totalBlood.toLocaleString()} <span className="text-sm text-gray-400 font-normal">ML</span></p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blood-50 flex items-center justify-center">
                <FiDroplet className="text-blood-600" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total In</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{totalIn.toLocaleString()} <span className="text-sm text-gray-400 font-normal">ML</span></p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <FiTrendingUp className="text-green-600" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Out</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{totalOut.toLocaleString()} <span className="text-sm text-gray-400 font-normal">ML</span></p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <FiActivity className="text-red-600" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Blood Groups</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{bloodData.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <FiPackage className="text-purple-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-2">
          <div className="flex space-x-1">
            {[
              { key: "overview", label: "Overview", icon: FiDroplet },
              { key: "records", label: "All Records", icon: FiPackage },
              { key: "near-expiry", label: "Near Expiry", icon: FiAlertTriangle },
              { key: "expired", label: "Expired", icon: FiClock }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-blood-500 text-white shadow-lg"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Blood Group Cards */}
            <div>
              <h2 className="text-lg font-bold text-dark-200 mb-4">Blood Group Availability</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {bloodData.map((g) => (
                  <BloodGroupCard key={g.bloodGroup} bloodGroup={g.bloodGroup} totalIn={g.totalIn} totalOut={g.totalOut} available={g.availabeBlood} expiryWarning={nearExpiryItems.some((e) => e.bloodGroup === g.bloodGroup)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {(activeTab === "near-expiry" || activeTab === "expired") && (
          <div>
            <h2 className="text-lg font-bold text-dark-200 mb-4">
              {activeTab === "near-expiry" ? "Units Near Expiry" : "Expired Units"}
            </h2>
            <DataTable columns={expiryColumns} data={expiryItems} emptyMessage="No expiry concerns" emptyIcon={FiAlertTriangle} />
          </div>
        )}

        {activeTab === "records" && (
          <div>
            <h2 className="text-lg font-bold text-dark-200 mb-4">All Inventory Records</h2>
            <DataTable columns={columns} data={records} loading={loading} searchable searchPlaceholder="Search by email or blood group..." emptyMessage="No inventory records" emptyIcon={FiPackage} />
          </div>
        )}
      </div>
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); fetchData(); }} />
    </Layout>
  );
};

export default InventoryManagement;
