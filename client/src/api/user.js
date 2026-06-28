// const API = import.meta.env.VITE_API_URL;
// 
// export const fetchResults = async (search, token) => {
//     const res = await fetch(`${API}/users?search=${search}`, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });
//     const data = await res.json();
//     return data;
// };

import { authFetch } from "../utils/authFetch";

const API = import.meta.env.VITE_API_URL;

export const fetchResults = async (query) => {
    return authFetch(`${API}/users?search=${encodeURIComponent(query)}`);
};