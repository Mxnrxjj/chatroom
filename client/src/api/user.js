import { authFetch } from "../utils/authFetch";

const API = import.meta.env.VITE_API_URL;

export const fetchResults = async (query) => {
    return authFetch(`${API}/users?search=${encodeURIComponent(query)}`);
};

export const updateProfile = async (profileData) => {
    return authFetch(`${API}/users/profile`, {
        method: "PUT",
        body: JSON.stringify(profileData),
    });
};
