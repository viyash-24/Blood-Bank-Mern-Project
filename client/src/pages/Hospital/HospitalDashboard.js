import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../../components/Layout/Layout";
import MembershipCard from "../../components/MembershipCard";
import StatCard from "../../components/ui/StatCard";
import BloodGroupCard from "../../components/BloodGroupCard";
import { FiActivity, FiClipboard, FiCheckCircle, FiClock } from "react-icons/fi";
import { getBloodGroupData } from "../../services/inventoryService";
import API from "../../services/API";

const HospitalDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [bloodData, setBloodData] = useState([]);

  const [myRequests, setMyRequests] = useState([]);

  const stats = {
    pending: myRequests.filter((r) => r.status === "pending").length,
    approved: myRequests.filter((r) => r.status === "approved").length,
    total: myRequests.length,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const [res, reqRes] = await Promise.allSettled([
          getBloodGroupData(),
          API.get("/request/get-hospital-requests")
        ]);
        if (res.status === "fulfilled" && res.value.data?.success) setBloodData(res.value.data.bloodGroupData || []);
        if (reqRes.status === "fulfilled" && reqRes.value.data?.success) setMyRequests(reqRes.value.data.requests || []);
      } catch (e) { console.log(e); }
    };
    fetch();
  }, []);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-dark-200 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-info-50 flex items-center justify-center">
              <FiActivity className="text-info-600" size={20} />
            </div>
            Hospital Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">Welcome, {user?.hospitalName || 'Hospital'}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Total Requests" value={stats.total} icon={FiClipboard} color="blue" />
          <StatCard title="Pending" value={stats.pending} icon={FiClock} color="amber" />
          <StatCard title="Approved" value={stats.approved} icon={FiCheckCircle} color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MembershipCard user={user} />
          <div>
            <h2 className="text-lg font-bold text-dark-200 mb-4">Blood Availability</h2>
            <div className="grid grid-cols-2 gap-3">
              {bloodData.slice(0, 4).map((g) => (
                <BloodGroupCard key={g.bloodGroup} bloodGroup={g.bloodGroup} available={g.availabeBlood} totalIn={g.totalIn} totalOut={g.totalOut} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HospitalDashboard;
