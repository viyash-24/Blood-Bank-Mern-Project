import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import DataTable from "../../components/ui/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";
import ConfirmModal from "../../components/Modal/ConfirmModal";
import MembershipCard from "../../components/MembershipCard";
import { FiUsers, FiTrash2, FiCheckCircle, FiEye, FiX } from "react-icons/fi";
import { BiDonateBlood } from "react-icons/bi";
import API from "../../services/API";
import { getDonorList, getHospitalList, getOrgList, deleteUser } from "../../services/adminService";
import { getRoleLabel, formatDate, generateMembershipId } from "../../utils/helpers";
import { toast } from "react-toastify";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [viewCard, setViewCard] = useState(null);
  const [showAddDonor, setShowAddDonor] = useState(false);
  const [newDonor, setNewDonor] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bloodGroup: "O+",
    healthConditionChecked: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [donorRes, hospRes, orgRes] = await Promise.allSettled([
        getDonorList(), getHospitalList(), getOrgList()
      ]);
      const allUsers = [
        ...(donorRes.status === 'fulfilled' ? (donorRes.value.data?.donarData || []) : []),
        ...(hospRes.status === 'fulfilled' ? (hospRes.value.data?.hospitalData || []) : []),
        ...(orgRes.status === 'fulfilled' ? (orgRes.value.data?.orgData || []) : []),
      ];
      setUsers(allUsers);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAddDonor = async (e) => {
    e.preventDefault();
    if (!newDonor.healthConditionChecked) {
      return toast.error("Please confirm the health condition check.");
    }
    setSubmitting(true);
    try {
      const { data } = await API.post("/admin/create-donor", newDonor);
      if (data?.success) {
        toast.success(data.message);
        setShowAddDonor(false);
        setNewDonor({
          name: "",
          email: "",
          phone: "",
          address: "",
          bloodGroup: "O+",
          healthConditionChecked: false,
        });
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create donor");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = activeFilter === "all" ? users : users.filter((u) => u.role === activeFilter);

  const filters = [
    { key: "all", label: "All" },
    { key: "donar", label: "Donors" },
    { key: "hospital", label: "Hospitals" },
    { key: "organisation", label: "Organisations" },
  ];

  const columns = [
    {
      header: "Name",
      render: (row) => (
        <div>
          <p className="font-semibold text-dark-200">{row.name || row.hospitalName || row.organisationName}</p>
          <p className="text-xs text-gray-400">{row.email}</p>
        </div>
      ),
      accessor: (row) => row.name || row.hospitalName || row.organisationName,
    },
    {
      header: "Role",
      render: (row) => (
        <StatusBadge status="active" label={getRoleLabel(row.role)} />
      ),
    },
    {
      header: "Member ID",
      render: (row) => (
        <span className="text-xs font-mono font-semibold text-gray-600">{generateMembershipId(row.role, row._id)}</span>
      ),
    },
    {
      header: "Phone",
      accessor: "phone",
      render: (row) => <span className="text-gray-600">{row.phone || '—'}</span>,
    },
    {
      header: "Joined",
      render: (row) => <span className="text-gray-500">{formatDate(row.createdAt)}</span>,
    },
    {
      header: "Health Status",
      render: (row) => (
        row.role === "donar" ? (
          <StatusBadge 
            status={row.healthConditionChecked ? "active" : "pending"} 
            label={row.healthConditionChecked ? "Qualified" : "Not Checked"} 
          />
        ) : <span className="text-gray-300">—</span>
      ),
    },
    {
      header: "Last Donation",
      render: (row) => (
        row.role === "donar" ? (
          <span className="text-xs font-medium text-gray-500">
            {row.lastDonationDate ? formatDate(row.lastDonationDate) : "Never"}
          </span>
        ) : <span className="text-gray-300">—</span>
      ),
    },
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-dark-200 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-info-50 flex items-center justify-center">
                <FiUsers className="text-info-600" size={20} />
              </div>
              User Management
            </h1>
            <p className="text-sm text-gray-500 mt-1 ml-[52px]">Manage all registered users</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddDonor(true)}
              className="px-4 py-2 bg-blood-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blood-500/20 hover:bg-blood-700 transition-all flex items-center gap-2"
            >
              <BiDonateBlood size={18} />
              Add New Donor
            </button>
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${activeFilter === f.key ? 'bg-white text-dark-200 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          searchable
          searchPlaceholder="Search users by name or email..."
          emptyMessage="No users found"
          emptyIcon={FiUsers}
          actions={(row) => (
            <>
              <button onClick={() => setViewCard(row)} className="p-2 rounded-lg text-gray-400 hover:text-info-600 hover:bg-info-50 transition-all" title="View Card">
                <FiEye size={16} />
              </button>
              <button onClick={() => setDeleteModal({ open: true, user: row })} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all" title="Delete">
                <FiTrash2 size={16} />
              </button>
            </>
          )}
        />
      </div>

      {/* Add Donor Modal */}
      {showAddDonor && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowAddDonor(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-glow-lg animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-dark-200">Register New Donor</h2>
                <button onClick={() => setShowAddDonor(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                  <FiX size={20} />
                </button>
              </div>
              <form onSubmit={handleAddDonor} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blood-500/20 focus:border-blood-500 outline-none transition-all"
                      placeholder="Enter donor name"
                      value={newDonor.name}
                      onChange={(e) => setNewDonor({ ...newDonor, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Email Address</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blood-500/20 focus:border-blood-500 outline-none transition-all"
                      placeholder="donor@example.com"
                      value={newDonor.email}
                      onChange={(e) => setNewDonor({ ...newDonor, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Phone</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blood-500/20 focus:border-blood-500 outline-none transition-all"
                        placeholder="Phone number"
                        value={newDonor.phone}
                        onChange={(e) => setNewDonor({ ...newDonor, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Blood Group</label>
                      <select
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blood-500/20 focus:border-blood-500 outline-none transition-all"
                        value={newDonor.bloodGroup}
                        onChange={(e) => setNewDonor({ ...newDonor, bloodGroup: e.target.value })}
                        required
                      >
                        {["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"].map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Address</label>
                    <textarea
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blood-500/20 focus:border-blood-500 outline-none transition-all resize-none h-24"
                      placeholder="Street address..."
                      value={newDonor.address}
                      onChange={(e) => setNewDonor({ ...newDonor, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
                    <input
                      type="checkbox"
                      id="healthCheck"
                      className="mt-1 w-4 h-4 rounded text-blood-600 focus:ring-blood-500 cursor-pointer"
                      checked={newDonor.healthConditionChecked}
                      onChange={(e) => setNewDonor({ ...newDonor, healthConditionChecked: e.target.checked })}
                    />
                    <label htmlFor="healthCheck" className="text-xs font-medium text-green-800 leading-relaxed cursor-pointer">
                      I confirm that the donor's health condition has been checked and they are qualified for blood donation.
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddDonor(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-3 bg-blood-600 text-white font-bold rounded-xl shadow-lg shadow-blood-500/30 hover:bg-blood-700 transition-all disabled:opacity-50"
                  >
                    {submitting ? "Processing..." : "Create Donor"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, user: null })}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteModal.user?.name || deleteModal.user?.hospitalName || deleteModal.user?.organisationName}? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="red"
      />

      {/* View Membership Card Modal  */}
      {viewCard && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setViewCard(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setViewCard(null)} className="mb-3 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all float-right">
                <FiX size={18} />
              </button>
              <div className="clear-both" />
              <MembershipCard user={viewCard} />
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default UserManagement;
