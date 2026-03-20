import React, { useEffect, useState } from "react";
import Layout from "./../../components/shared/Layout/Layout";
import moment from "moment";
import API from "../../services/API";
import { FiUsers, FiClock, FiTrash2 } from "react-icons/fi";

const DonarList = () => {
  const [data, setData] = useState([]);
  //find donar records
  const getDonars = async () => {
    try {
      const { data } = await API.get("/admin/donar-list");
      if (data?.success) {
        setData(data?.donarData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDonars();
  }, []);

  //DELETE USER FUNCTION
  const handelDelete = async (id) => {
    try {
      let answer = window.prompt(
        "Are You SUre Want To Delete This Donar",
        "Sure"
      );
      if (!answer) return;
      const { data } = await API.delete(`/admin/delete-donar/${id}`);
      alert(data?.message);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-200 tracking-tight flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blood-50 flex items-center justify-center">
            <FiUsers className="text-blood-600" size={20} />
          </div>
          Donor List
        </h1>
        <p className="text-sm text-gray-500 mt-1 ml-[52px]">
          Manage all donors — view details and remove records
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden animate-fade-in-up">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50/80 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blood-500 to-blood-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {(record.name || record.organisationName || "U").charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-dark-200">
                        {record.name || record.organisationName + " (ORG)"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.phone}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiClock size={14} className="text-gray-400" />
                      {moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all duration-200 hover:shadow-md"
                      onClick={() => handelDelete(record._id)}
                    >
                      <FiTrash2 size={14} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FiUsers size={40} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">No donors found</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DonarList;
