import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../../components/Layout/Layout";
import MembershipCard from "../../components/MembershipCard";
import StatCard from "../../components/ui/StatCard";
import BloodGroupCard from "../../components/BloodGroupCard";
import AlertBanner from "../../components/ui/AlertBanner";
import { FiGrid, FiDroplet, FiUsers, FiPackage } from "react-icons/fi";
import { getBloodGroupData, getInventory } from "../../services/inventoryService";

const OrgDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [bloodData, setBloodData] = useState([]);
  const [recordCount, setRecordCount] = useState(0);

  const urgentNotifications = [];

  useEffect(() => {
    const fetch = async () => {
      try {
        const [bloodRes, invRes] = await Promise.allSettled([getBloodGroupData(), getInventory()]);
        if (bloodRes.status === "fulfilled") setBloodData(bloodRes.value.data?.bloodGroupData || []);
        if (invRes.status === "fulfilled") setRecordCount(invRes.value.data?.inventory?.length || 0);
      } catch (e) { console.log(e); }
    };
    fetch();
  }, []);

  const totalBlood = bloodData.reduce((sum, g) => sum + (g.availabeBlood || 0), 0);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-dark-200 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <FiGrid className="text-emerald-600" size={20} />
            </div>
            Organisation Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">Welcome, {user?.organisationName || 'Organisation'}</p>
        </div>

        {/* Urgent Alerts */}
        {urgentNotifications.map((n) => (
          <AlertBanner key={n._id} type="error" title={n.title} message={n.message} />
        ))}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Total Blood (ML)" value={totalBlood.toLocaleString()} icon={FiDroplet} color="blood" />
          <StatCard title="Inventory Records" value={recordCount} icon={FiPackage} color="blue" />
          <StatCard title="Blood Groups" value={bloodData.length} icon={FiGrid} color="emerald" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MembershipCard user={user} />
          <div>
            <h2 className="text-lg font-bold text-dark-200 mb-4">Blood Inventory</h2>
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

export default OrgDashboard;
