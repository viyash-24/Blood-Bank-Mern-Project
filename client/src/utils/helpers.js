import moment from "moment";

// Check if donor is eligible to donate (6- month cooldown)
export const isDonorEligible = (lastDonationDate) => {
  if (!lastDonationDate) return { eligible: true, daysRemaining: 0 };
  const sixMonthsAgo = moment().subtract(6, 'months');
  const lastDonation = moment(lastDonationDate);
  const eligible = lastDonation.isBefore(sixMonthsAgo);
  const nextEligible = lastDonation.add(6, 'months');
  const daysRemaining = eligible ? 0 : nextEligible.diff(moment(), 'days');
  return { eligible, daysRemaining, nextEligibleDate: nextEligible.format('DD MMM YYYY') };
};

// Check if blood is near expiry (within 7 days)
export const getExpiryStatus = (expiryDate) => {
  if (!expiryDate) return 'valid';
  const now = moment();
  const expiry = moment(expiryDate);
  if (expiry.isBefore(now)) return 'expired';
  if (expiry.diff(now, 'days') <= 7) return 'near-expiry';
  return 'valid';
};

// Format relative time
export const timeAgo = (date) => moment(date).fromNow();

// Format date
export const formatDate = (date, format = 'DD MMM YYYY') => moment(date).format(format);

// Format date with time
export const formatDateTime = (date) => moment(date).format('DD/MM/YYYY hh:mm A');

// Get user display name
export const getUserDisplayName = (user) => {
  if (!user) return 'User';
  return user.name || user.hospitalName || user.organisationName || 'User';
};

// Get role label
export const getRoleLabel = (role) => {
  const labels = { admin: 'Admin', donar: 'Donor', hospital: 'Hospital', organisation: 'Organisation' };
  return labels[role] || role;
};

// Get role color classes
export const getRoleColor = (role) => {
  const colors = {
    admin: 'bg-purple-50 text-purple-700 border-purple-200',
    donar: 'bg-blood-50 text-blood-600 border-blood-200',
    hospital: 'bg-info-50 text-info-700 border-info-100',
    organisation: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
  return colors[role] || 'bg-gray-50 text-gray-700 border-gray-200';
};

// Get blood group color
export const getBloodGroupColor = (group) => {
  const colors = {
    'O+': 'from-red-500 to-rose-600',
    'O-': 'from-red-600 to-red-700',
    'A+': 'from-blue-500 to-blue-600',
    'A-': 'from-blue-600 to-indigo-700',
    'B+': 'from-emerald-500 to-green-600',
    'B-': 'from-emerald-600 to-green-700',
    'AB+': 'from-purple-500 to-violet-600',
    'AB-': 'from-purple-600 to-violet-700',
  };
  return colors[group] || 'from-gray-500 to-gray-600';
};

// Get status badge styles
export const getStatusStyle = (status) => {
  const styles = {
    pending: 'bg-warning-50 text-warning-700 border-warning-100',
    approved: 'bg-success-50 text-success-700 border-success-100',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    expired: 'bg-red-50 text-red-700 border-red-200',
    'near-expiry': 'bg-warning-50 text-warning-700 border-warning-100',
    active: 'bg-success-50 text-success-700 border-success-100',
  };
};

// Generate Membership ID
export const generateMembershipId = (role, id) => {
  const prefix = { admin: 'ADM', donar: 'DNR', hospital: 'HSP', organisation: 'ORG' };
  const shortId = id ? id.slice(-6).toUpperCase() : Math.random().toString(36).slice(-6).toUpperCase();
  return `${prefix[role] || 'USR'}-${shortId}`;
};
