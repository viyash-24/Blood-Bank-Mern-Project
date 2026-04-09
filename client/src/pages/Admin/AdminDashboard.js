import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import StatCard from "../../components/ui/StatCard";
import BloodGroupCard from "../../components/BloodGroupCard";
import AlertBanner from "../../components/ui/AlertBanner";
import StatusBadge from "../../components/ui/StatusBadge";
import { FiUsers, FiActivity, FiGrid, FiDroplet, FiClock, FiSend } from "react-icons/fi";
import { getDonorList, getHospitalList, getOrgList } from "../../services/adminService";
import { getBloodGroupData } from "../../services/inventoryService";
import { formatDateTime } from "../../utils/helpers";
import API from "../../services/API";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ donors: 0, hospitals: 0, orgs: 0 });
  const [bloodData, setBloodData] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const nearExpiryItems = [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donorRes, hospRes, orgRes, bloodRes, reqRes] = await Promise.allSettled([
          getDonorList(), getHospitalList(), getOrgList(), getBloodGroupData(), API.get("/request/get-all-requests")
        ]);
        setStats({
          donors: donorRes.status === 'fulfilled' ? donorRes.value.data?.donarData?.length || 0 : 0,
          hospitals: hospRes.status === 'fulfilled' ? hospRes.value.data?.hospitalData?.length || 0 : 0,
          orgs: orgRes.status === 'fulfilled' ? orgRes.value.data?.orgData?.length || 0 : 0,
        });
        if (bloodRes.status === 'fulfilled') setBloodData(bloodRes.value.data?.bloodGroupData || []);
        if (reqRes.status === 'fulfilled' && reqRes.value.data?.success) {
          setPendingRequests(reqRes.value.data.requests.filter(r => r.status === 'pending').slice(0, 5));
        }
      } catch (err) { console.log(err); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalBlood = bloodData.reduce((sum, g) => sum + (g.availabeBlood || 0), 0);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-dark-200 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <FiGrid className="text-purple-600" size={20} />
            </div>
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">System overview and management</p>
        </div>

        {/* Expiry Alerts */}
        {nearExpiryItems.length > 0 && (
          <AlertBanner
            type="warning"
            title={`${nearExpiryItems.length} blood units expiring soon`}
            message="Some blood units will expire within 7 days. Review inventory immediately."
          />
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Donors" value={loading ? "..." : stats.donors} icon={FiUsers} color="blood" trend={12} trendLabel="this month" />
          <StatCard title="Total Hospitals" value={loading ? "..." : stats.hospitals} icon={FiActivity} color="blue" trend={5} trendLabel="this month" />
          <StatCard title="Total Organisations" value={loading ? "..." : stats.orgs} icon={FiGrid} color="emerald" trend={8} trendLabel="this month" />
          <StatCard title="Total Blood (ML)" value={loading ? "..." : totalBlood.toLocaleString()} icon={FiDroplet} color="purple" />
        </div>

        

       
       

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-dark-200 mb-4">Incoming Blood Requests</h2>
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hospital</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Blood Group</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Urgency</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {pendingRequests.map((req) => (
                      <tr key={req._id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-dark-200">{req.hospitalName}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-blood-600 bg-blood-50 rounded-lg">
                            <FiDroplet size={12} /> {req.bloodGroup}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-dark-200">{req.quantity} <span className="text-gray-400 font-normal">ML</span></td>
                        <td className="px-6 py-4">
                          <StatusBadge status={req.urgency === 'urgent' ? 'rejected' : 'active'} label={req.urgency === 'urgent' ? 'Urgent' : 'Normal'} />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-1.5"><FiClock size={14} /> {formatDateTime(req.createdAt)}</td>
                        <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
