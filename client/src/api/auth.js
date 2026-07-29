const API = import.meta.env.VITE_API_URL;
import { authFetch } from "../utils/authFetch";

const registerUser = async (userData) => {
    const res = await fetch(
        `${API}/users/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        },
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Registration failed");
    }
    return data;
};

const loginUser = async (userData) => {
    const res = await fetch(`${API}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Login failed");
    }
    return data;
};

const changePassword = async (currentPassword, newPassword) => {
    return authFetch(`${API}/users/change-password`, {
        method: "PUT",
        body: JSON.stringify({
            currentPassword,
            newPassword,
        }),
    });
};

export { registerUser, loginUser, changePassword };
