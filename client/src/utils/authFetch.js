import { getToken, logout } from "./auth";

export const authFetch = async (url, options = {}) => {
    const token = getToken();

    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
            Authorization: `Bearer ${token}`,
        }
    });

    if (res.status === 401) {
        logout();

        if (window.location.pathname !== "/login") {
            window.location.href = "/login";
        }

        throw new Error("Session expired");
    }

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Request failed");
    }

    return res.json();
}