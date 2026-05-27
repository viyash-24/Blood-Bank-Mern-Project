import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../../components/layout/Layout";
import MembershipCard from "../../components/common/MembershipCard";
import StatCard from "../../components/ui/StatCard";
import AlertBanner from "../../components/ui/AlertBanner";
import { FiHeart, FiCalendar, FiDroplet, FiClock } from "react-icons/fi";
import { isDonorEligible } from "../../utils/helpers";
import API from "../../api/axiosInstance";

const DonorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [donationHistory, setDonationHistory] = useState([]);
  const lastDonation = donationHistory[0]?.createdAt;
  const eligibility = isDonorEligible(lastDonation);

  useEffect(() => {
    const fetch = async () => {
      try {
        const invRes = await API.get("/inventory/get-inventory");
        if (invRes.data?.success) setDonationHistory(invRes.data.inventory || []);
      } catch (e) { console.log(e); }
    };
    fetch();
  }, []);

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 lg:gap-8 items-start animate-fade-in">
        <div className="min-w-0 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-dark-200 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blood-50 flex items-center justify-center">
                <FiHeart className="text-blood-600" size={20} />
              </div>
              Donor Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1 ml-[52px]">Welcome back, {user?.name || "Donor"}</p>
          </div>

          {/* Eligibility Alert */}
          {!eligibility.eligible ? (
            <AlertBanner
              type="info"
              title={`Next eligible donation: ${eligibility.nextEligibleDate}`}
              message={`You need to wait ${eligibility.daysRemaining} more days before your next donation.`}
            />
          ) : (
            <AlertBanner
              type="success"
              title="You are eligible to donate!"
              message="You can donate blood now. Visit your nearest blood bank."
            />
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard title="Total Donations" value={donationHistory.length} icon={FiHeart} color="blood" />
            <StatCard
              title="Days Until Eligible"
              value={eligibility.eligible ? "Ready!" : `${eligibility.daysRemaining} days`}
              icon={FiCalendar}
              color="blue"
            />
            <StatCard
              title="Last Donation"
              value={
                lastDonation
                  ? new Date(lastDonation).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Never"
              }
              icon={FiClock}
              color="emerald"
            />
          </div>

          {/* Recent Donations */}
          <div>
            <h2 className="text-lg font-bold text-dark-200 mb-4">Recent Donations</h2>
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Blood Group
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Organisation
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {donationHistory.map((d) => (
                      <tr key={d._id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-blood-600 bg-blood-50 rounded-lg">
                            <FiDroplet size={12} /> {d.bloodGroup}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-dark-200">
                          {d.quantity} <span className="text-gray-400 font-normal">ML</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{d.organisation?.organisationName || "Unknown"}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(d.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <aside className="w-full min-w-0 self-start lg:w-[320px] lg:shrink-0">
          <MembershipCard user={user} className="lg:sticky lg:top-4" />
        </aside>
      </div>
    </Layout>
  );
};

export default DonorDashboard;
