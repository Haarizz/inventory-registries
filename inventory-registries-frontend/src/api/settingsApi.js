import axios from "./axiosConfig";

// FETCH USERS
export const fetchUsers = async () => {
  const res = await axios.get("/api/settings/users");
  return res.data;
};

// UPDATE ROLE
export const updateUserRole = async (id, role) => {
  const res = await axios.put(`/api/settings/users/${id}/role`, { role });
  return res.data;
};
