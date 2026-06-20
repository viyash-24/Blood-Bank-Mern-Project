import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import StatCard from "../../components/ui/StatCard";
import BloodGroupCard from "../../components/common/BloodGroupCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { FiUsers, FiActivity, FiGrid, FiDroplet, FiClock, FiCheckCircle, FiAlertCircle, FiArrowRight } from "react-icons/fi";
import { BiDonateBlood } from "react-icons/bi";
import { formatDateTime } from "../../utils/helpers";
import API from "../../api/axiosInstance";
import { Link } from "react-router-dom";

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
    <div className="w-10 h-10 bg-gray-100 rounded-xl mb-3" />
    <div className="h-7 bg-gray-100 rounded-lg w-16 mb-1" />
    <div className="h-3 bg-gray-100 rounded w-24" />
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/admin/dashboard-stats");
        if (res.data?.success) setData(res.data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const stats = data?.stats || { donors: 0, hospitals: 0, orgs: 0 };
  const bloodGroupData = data?.bloodGroupData || [];
  const pendingRequests = data?.pendingRequests || [];
  const totalBlood = bloodGroupData.reduce((sum, g) => sum + (g.availabeBlood || 0), 0);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-200 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <FiGrid className="text-purple-600" size={20} />
              </div>
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1 ml-[52px]">System overview and management</p>
          </div>
          {!loading && pendingRequests.length > 0 && (
            <Link
              to="/admin/requests"
              className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-sm font-semibold hover:bg-amber-100 transition-all"
            >
              <FiAlertCircle size={15} />
              {pendingRequests.length} Pending
              <FiArrowRight size={13} />
            </Link>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <StatCard title="Total Donors" value={stats.donors} icon={FiUsers} color="blood" />
              <StatCard title="Hospitals" value={stats.hospitals} icon={FiActivity} color="blue" />
              <StatCard title="Organisations" value={stats.orgs} icon={FiGrid} color="emerald" />
              <StatCard title="Total Blood (ML)" value={totalBlood.toLocaleString()} icon={FiDroplet} color="purple" />
            </>
          )}
        </div>

        {/* Blood Inventory Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-dark-200 flex items-center gap-2">
              <BiDonateBlood className="text-blood-500" size={20} />
              Blood Inventory
            </h2>
            <span className="text-xs text-gray-400 font-medium">All organisations combined</span>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl mb-3 mx-auto" />
                  <div className="h-5 bg-gray-100 rounded w-12 mb-1 mx-auto" />
                  <div className="h-3 bg-gray-100 rounded w-16 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {bloodGroupData.map((g) => (
                <BloodGroupCard
                  key={g.bloodGroup}
                  bloodGroup={g.bloodGroup}
                  available={g.availabeBlood}
                  totalIn={g.totalIn}
                  totalOut={g.totalOut}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pending Requests Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-dark-200 flex items-center gap-2">
              <FiClock className="text-amber-500" size={18} />
              Pending Blood Requests
            </h2>
            {pendingRequests.length > 0 && (
              <Link
                to="/admin/requests"
                className="text-xs text-blood-600 font-semibold hover:underline flex items-center gap-1"
              >
                View all <FiArrowRight size={12} />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-5 bg-gray-100 rounded w-32" />
                  <div className="h-5 bg-gray-100 rounded w-16" />
                  <div className="h-5 bg-gray-100 rounded w-20" />
                  <div className="h-5 bg-gray-100 rounded w-24" />
                </div>
              ))}
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <div className="w-14 h-14 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiCheckCircle className="text-success-500" size={26} />
              </div>
              <p className="text-dark-200 font-semibold">All caught up!</p>
              <p className="text-sm text-gray-400 mt-1">No pending blood requests at this time.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hospital</th>
                      <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Blood Group</th>
                      <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Urgency</th>
                      <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {pendingRequests.map((req) => (
                      <tr key={req._id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-dark-200">
                          {req.hospital?.hospitalName || req.hospital?.email || "Unknown"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-blood-600 bg-blood-50 rounded-lg">
                            <FiDroplet size={12} /> {req.bloodGroup}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-dark-200">
                          {req.quantity} <span className="text-gray-400 font-normal">ML</span>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge
                            status={req.urgency === "urgent" ? "rejected" : "active"}
                            label={req.urgency === "urgent" ? "Urgent" : "Normal"}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-1.5">
                          <FiClock size={13} /> {formatDateTime(req.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={req.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100">
                <Link
                  to="/admin/requests"
                  className="text-xs text-blood-600 font-semibold hover:underline flex items-center gap-1 w-fit"
                >
                  Manage all requests <FiArrowRight size={12} />
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default AdminDashboard;
