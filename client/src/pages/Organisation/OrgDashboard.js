import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../../components/Layout/Layout";
import MembershipCard from "../../components/common/MembershipCard";
import StatCard from "../../components/ui/StatCard";
import AlertBanner from "../../components/ui/AlertBanner";
import { FiGrid, FiUsers, FiPackage } from "react-icons/fi";
import { getInventory } from "../../api/inventoryService";

const OrgDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [recordCount, setRecordCount] = useState(0);

  const urgentNotifications = [];

  useEffect(() => {
    const fetch = async () => {
      try {
        const invRes = await getInventory();
        setRecordCount(invRes.data?.inventory?.length || 0);
      } catch (e) { console.log(e); }
    };
    fetch();
  }, []);

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 lg:gap-8 items-start animate-fade-in">
        <div className="min-w-0 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-200 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <FiGrid className="text-emerald-600" size={20} />
              </div>
              Organisation Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1 ml-[52px]">Welcome, {user?.organisationName || "Organisation"}</p>
          </div>

          {urgentNotifications.map((n) => (
            <AlertBanner key={n._id} type="error" title={n.title} message={n.message} />
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
            <StatCard title="Inventory Records" value={recordCount} icon={FiPackage} color="blue" />
            <StatCard title="Organisation" value={user?.organisationName || "—"} icon={FiUsers} color="emerald" />
          </div>
        </div>

        <aside className="w-full min-w-0 self-start lg:w-[320px] lg:shrink-0">
          <MembershipCard user={user} className="lg:sticky lg:top-4" />
        </aside>
      </div>
    </Layout>
  );
};

export default OrgDashboard;
