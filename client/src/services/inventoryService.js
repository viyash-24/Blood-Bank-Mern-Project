import API from "./API";

// Get all inventory records
export const getInventory = () => API.get("/inventory/get-inventory");

// Get recent inventory records
export const getRecentInventory = () => API.get("/inventory/get-recent-inventory");

// Create inventory record
export const createInventory = (data) => API.post("/inventory/create-inventory", data);

// Get inventory by filters (hospital)
export const getInventoryByHospital = (filters) => API.post("/inventory/get-inventory-hospital", { filters });

// Get donors for org
export const getDonors = () => API.get("/inventory/get-donars");

// Get hospitals for org
export const getHospitals = () => API.get("/inventory/get-hospitals");

// Get organisations for donor
export const getOrganisations = () => API.get("/inventory/get-orgnaisation");

// Get organisations for hospital
export const getOrganisationsForHospital = () => API.get("/inventory/get-orgnaisation-for-hospital");

// Get blood group analytics
export const getBloodGroupData = () => API.get("/analytics/bloodGroups-data");
