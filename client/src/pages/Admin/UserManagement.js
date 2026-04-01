import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import DataTable from "../../components/ui/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";
import ConfirmModal from "../../components/Modal/ConfirmModal";
import MembershipCard from "../../components/MembershipCard";
import { FiUsers, FiTrash2, FiCheckCircle, FiEye, FiX } from "react-icons/fi";
import { getDonorList, getHospitalList, getOrgList, deleteUser } from "../../services/adminService";
import { getRoleLabel, formatDate, generateMembershipId } from "../../utils/helpers";
import { toast } from "react-toastify";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [viewCard, setViewCard] = useState(null);

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

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    try {
      await deleteUser(deleteModal.user._id);
      toast.success("User deleted successfully");
      setDeleteModal({ open: false, user: null });
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
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

      {/* View Membership Card Modal */}
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
