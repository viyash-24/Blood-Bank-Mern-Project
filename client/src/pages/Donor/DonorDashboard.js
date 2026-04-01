import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../../components/Layout/Layout";
import MembershipCard from "../../components/MembershipCard";
import StatCard from "../../components/ui/StatCard";
import AlertBanner from "../../components/ui/AlertBanner";
import BloodGroupCard from "../../components/BloodGroupCard";
import { FiHeart, FiCalendar, FiDroplet, FiClock } from "react-icons/fi";
import { isDonorEligible } from "../../utils/helpers";
import { getBloodGroupData } from "../../services/inventoryService";
import API from "../../services/API";

const DonorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [bloodData, setBloodData] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);
  const lastDonation = donationHistory[0]?.createdAt;
  const eligibility = isDonorEligible(lastDonation);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [res, invRes] = await Promise.allSettled([getBloodGroupData(), API.get("/inventory/get-inventory")]);
        if (res.status === "fulfilled" && res.value.data?.success) setBloodData(res.value.data.bloodGroupData || []);
        if (invRes.status === "fulfilled" && invRes.value.data?.success) setDonationHistory(invRes.value.data.inventory || []);
      } catch (e) { console.log(e); }
    };
    fetch();
  }, []);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-dark-200 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blood-50 flex items-center justify-center">
              <FiHeart className="text-blood-600" size={20} />
            </div>
            Donor Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">Welcome back, {user?.name || 'Donor'}</p>
        </div>

        {/* Eligibility Alert */}
        {!eligibility.eligible ? (
          <AlertBanner type="info" title={`Next eligible donation: ${eligibility.nextEligibleDate}`} message={`You need to wait ${eligibility.daysRemaining} more days before your next donation.`} />
        ) : (
          <AlertBanner type="success" title="You are eligible to donate!" message="You can donate blood now. Visit your nearest blood bank." />
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Total Donations" value={donationHistory.length} icon={FiHeart} color="blood" />
          <StatCard title="Days Until Eligible" value={eligibility.eligible ? "Ready!" : `${eligibility.daysRemaining} days`} icon={FiCalendar} color="blue" />
          <StatCard title="Last Donation" value={lastDonation ? new Date(lastDonation).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Never'} icon={FiClock} color="emerald" />
        </div>

        {/* Membership Card + Blood Availability side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MembershipCard user={user} />
          <div>
            <h2 className="text-lg font-bold text-dark-200 mb-4">Blood Availability</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {bloodData.slice(0, 4).map((g) => (
                <BloodGroupCard key={g.bloodGroup} bloodGroup={g.bloodGroup} available={g.availabeBlood} totalIn={g.totalIn} totalOut={g.totalOut} />
              ))}
            </div>
          </div>
        </div>

        {/* Recent Donations */}
        <div>
          <h2 className="text-lg font-bold text-dark-200 mb-4">Recent Donations</h2>
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Blood Group</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Organisation</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {donationHistory.map((d) => (
                    <tr key={d._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-blood-600 bg-blood-50 rounded-lg"><FiDroplet size={12} /> {d.bloodGroup}</span></td>
                      <td className="px-6 py-4 text-sm font-semibold text-dark-200">{d.quantity} <span className="text-gray-400 font-normal">ML</span></td>
                      <td className="px-6 py-4 text-sm text-gray-600">{d.organisation?.organisationName || "Unknown"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(d.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DonorDashboard;
