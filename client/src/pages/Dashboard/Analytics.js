import React, { useState, useEffect } from "react";
import Header from "../../components/shared/Layout/Header";
import API from "./../../services/API";
import moment from "moment";
import { FiDroplet, FiArrowUpRight, FiArrowDownLeft, FiClock, FiActivity } from "react-icons/fi";

const Analytics = () => {
  const [data, setData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const cardGradients = [
    "from-rose-500 to-rose-600",
    "from-amber-500 to-orange-600",
    "from-yellow-400 to-amber-500",
    "from-blue-400 to-blue-600",
    "from-indigo-500 to-purple-600",
    "from-sky-400 to-blue-500",
    "from-pink-500 to-rose-500",
    "from-emerald-400 to-teal-500",
  ];

  //GET BLOOD GROUP DATA
  const getBloodGroupData = async () => {
    try {
      const { data } = await API.get("/analytics/bloodGroups-data");
      if (data?.success) {
        setData(data?.bloodGroupData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBloodGroupData();
  }, []);

  //get records function
  const getBloodRecords = async () => {
    try {
      const { data } = await API.get("/inventory/get-recent-inventory");
      if (data?.success) {
        setInventoryData(data?.inventory);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBloodRecords();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="animate-fade-in">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-dark-200 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blood-50 flex items-center justify-center">
                  <FiActivity className="text-blood-600" size={20} />
                </div>
                Blood Analytics
              </h1>
              <p className="text-sm text-gray-500 mt-1 ml-[52px]">
                Overview of blood group availability and transactions
              </p>
            </div>

            {/* Blood Group Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
              {data?.map((record, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className={`bg-gradient-to-br ${cardGradients[i % cardGradients.length]} p-5`}>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                    {/* Blood Group Label */}
                    <div className="relative">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg mb-4">
                        <FiDroplet size={16} className="text-white" />
                        <span className="text-lg font-extrabold text-white">{record.bloodGroup}</span>
                      </div>

                      {/* Stats */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-white/90">
                          <div className="flex items-center gap-2 text-sm">
                            <FiArrowDownLeft size={14} />
                            <span>Total In</span>
                          </div>
                          <span className="font-bold">{record.totalIn} ML</span>
                        </div>
                        <div className="flex items-center justify-between text-white/90">
                          <div className="flex items-center gap-2 text-sm">
                            <FiArrowUpRight size={14} />
                            <span>Total Out</span>
                          </div>
                          <span className="font-bold">{record.totalOut} ML</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Available Footer */}
                  <div className="bg-dark-500 px-5 py-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Available</span>
                      <span className="text-white text-lg font-bold">{record.availabeBlood} <span className="text-sm font-normal text-gray-400">ML</span></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Blood Transactions */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-dark-200 tracking-tight mb-1">
                Recent Blood Transactions
              </h2>
              <p className="text-sm text-gray-500">Latest blood inventory activity</p>
            </div>

            <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden animate-fade-in-up">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Blood Group</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Inventory Type</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Donor Email</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time & Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {inventoryData?.map((record) => (
                      <tr key={record._id} className="hover:bg-gray-50/80 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-blood-600 bg-blood-50 rounded-lg">
                            <FiDroplet size={14} />
                            {record.bloodGroup}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                            record.inventoryType === "in"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              record.inventoryType === "in" ? "bg-green-500" : "bg-red-500"
                            }`} />
                            {record.inventoryType === "in" ? "IN" : "OUT"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-dark-200">
                          {record.quantity} <span className="text-gray-400 font-normal">ML</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{record.email}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FiClock size={14} className="text-gray-400" />
                            {moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
