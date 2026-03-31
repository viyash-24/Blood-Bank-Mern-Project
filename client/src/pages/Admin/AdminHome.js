import React from "react";
import Layout from "../../components/shared/Layout/Layout";
import { useSelector } from "react-redux";
import { FiShield, FiUsers, FiActivity, FiGrid, FiDroplet } from "react-icons/fi";
import { BiDonateBlood } from "react-icons/bi";

const AdminHome = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Layout>
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-500 via-dark-400 to-dark-600 p-8 lg:p-12 mb-8 shadow-elevated">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blood-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blood-500/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blood-600 to-blood-400 flex items-center justify-center shadow-glow">
              <FiShield className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Welcome back</p>
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                Admin <span className="bg-gradient-to-r from-blood-400 to-blood-300 bg-clip-text text-transparent">{user?.name}</span>
              </h1>
            </div>
          </div>
          <p className="text-gray-400 mt-2 max-w-2xl">
            Manage your Blood Bank Application from this dashboard. Monitor donors, hospitals and organisations.
          </p>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-blood-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <FiUsers className="text-blood-600" size={24} />
          </div>
          <h3 className="text-lg font-bold text-dark-200">Donor Management</h3>
          <p className="text-sm text-gray-500 mt-1">View and manage all registered donors in the system</p>
        </div>

        <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <FiActivity className="text-blue-600" size={24} />
          </div>
          <h3 className="text-lg font-bold text-dark-200">Hospital Records</h3>
          <p className="text-sm text-gray-500 mt-1">Monitor hospital accounts, requests, and distributions</p>
        </div>

        <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <FiGrid className="text-purple-600" size={24} />
          </div>
          <h3 className="text-lg font-bold text-dark-200">Organisations</h3>
          <p className="text-sm text-gray-500 mt-1">Oversee organization registrations and activities</p>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-card animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blood-50 flex items-center justify-center">
            <BiDonateBlood className="text-blood-600" size={20} />
          </div>
          <h2 className="text-xl font-bold text-dark-200">About Blood Bank Application</h2>
        </div>

        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <p>
            Our Blood Bank Application is a role-based management system developed primarily for blood service operations. The system is designed to efficiently connect and manage four main user roles: Donors, Organizations, Hospitals, and Administrators. Each user type has specific permissions and responsibilities within the platform to ensure smooth and secure blood bank operations.
          </p>
          <p>
            Donors can register through the application and create their profiles by providing necessary personal and blood group details. Similarly, organizations and hospitals can also register and join the system. Once registered and approved, donors can contribute blood, and the blood bank staff records and safely stores the donated blood in the system. The application maintains detailed records of blood type, quantity, storage status, and availability to ensure proper management and quick access when needed.
          </p>
          <p>
            Hospitals and authorized organizations can easily request blood units through the platform whenever required. The system allows efficient tracking and distribution of blood based on availability, ensuring that patients receive blood without unnecessary delays. After registration, users can update their relevant details, manage requests, and monitor the status of blood availability in real time.
          </p>
          <p>
            The Administrator has full control over the system. The admin can manage donor, organization and hospital accounts, including adding, updating, approving, or deleting records. Additionally, the administrator oversees blood inventory management, monitors system activities, and ensures that all operations are conducted accurately and securely.
          </p>
          <p>
            Overall, the Blood Bank Application provides a structured, transparent, and efficient digital solution for managing blood donations, storage, and distribution while improving coordination between donors, hospitals, and organizations.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminHome;