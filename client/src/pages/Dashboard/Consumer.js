import React, { useCallback, useEffect, useState } from "react";
import Layout from "../../components/shared/Layout/Layout";
import moment from "moment";
import API from "../../services/API";
import { useSelector } from "react-redux";
import { FiShoppingCart, FiDroplet, FiClock } from "react-icons/fi";

const Consumer = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  //find donar records
  const getDonars = useCallback(async () => {
    try {
      if (!user?._id) {
        return;
      }
      const { data } = await API.post("/inventory/get-inventory-hospital", {
        filters: {
          inventoryType: "out",
          hospital: user?._id,
        },
      });
      if (data?.success) {
        setData(data?.inventory);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  useEffect(() => {
    getDonars();
  }, [getDonars]);

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-200 tracking-tight flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <FiShoppingCart className="text-amber-600" size={20} />
          </div>
          Consumer Records
        </h1>
        <p className="text-sm text-gray-500 mt-1 ml-[52px]">
          Track all blood consumption records
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden animate-fade-in-up">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Blood Group</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Inventory Type</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50/80 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-blood-600 bg-blood-50 rounded-lg">
                      <FiDroplet size={14} />
                      {record.bloodGroup}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200">
                      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-red-500" />
                      OUT
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

          {data?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FiShoppingCart size={40} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">No consumer records found</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Consumer;
