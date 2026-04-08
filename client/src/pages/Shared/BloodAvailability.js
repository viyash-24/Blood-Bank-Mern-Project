import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import BloodGroupCard from "../../components/BloodGroupCard";
import { FiDroplet } from "react-icons/fi";
import { getBloodGroupData } from "../../services/inventoryService";

const BloodAvailability = ({ title = "Blood Availability", subtitle = "View blood stock across all groups" }) => {
  const [bloodData, setBloodData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getBloodGroupData();
        if (res.data?.success) setBloodData(res.data.bloodGroupData || []);
      } catch (e) { console.log(e); }
      setLoading(false);
    };
    fetch();
  }, []);

  const totalAvailable = bloodData.reduce((sum, g) => sum + (g.availabeBlood || 0), 0);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-dark-200 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blood-50 flex items-center justify-center">
              <FiDroplet className="text-blood-600" size={20} />
            </div>
            {title}
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">{subtitle}</p>
        </div>

        {/* Total */}
        <div className="bg-gradient-to-r from-blood-600 to-blood-500 rounded-2xl p-6 text-white shadow-glow">
          <p className="text-sm font-medium opacity-80">Total Available Blood</p>
          <p className="text-4xl font-bold mt-1">{loading ? '...' : totalAvailable.toLocaleString()} <span className="text-lg font-normal opacity-60">ML</span></p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 animate-pulse">
                <div className="w-14 h-14 rounded-xl bg-gray-100 mb-4" />
                <div className="h-6 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-50 rounded w-1/3" />
              </div>
            ))
          ) : (
            bloodData.map((g) => (
              <BloodGroupCard key={g.bloodGroup} bloodGroup={g.bloodGroup} totalIn={g.totalIn} totalOut={g.totalOut} available={g.availabeBlood} />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BloodAvailability;
