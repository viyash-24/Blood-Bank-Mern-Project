import API from "./API";

// Get all donors (admin)
export const getDonorList = () => API.get("/admin/donar-list");

// Get all hospitals (admin)
export const getHospitalList = () => API.get("/admin/hospital-list");

// Get all organisations (admin)
export const getOrgList = () => API.get("/admin/org-list");

// Delete a donor (admin)
export const deleteUser = (id) => API.delete(`/admin/delete-donar/${id}`);

// Create blood request (admin)
export const createBloodRequest = (requestData) => API.post("/admin/create-blood-request", requestData);

// Get admin blood requests
export const getAdminBloodRequests = () => API.get("/admin/blood-requests");
