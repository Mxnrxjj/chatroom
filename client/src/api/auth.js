const API = import.meta.env.VITE_API_URL;

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
    // console.log("Registration response:", res);
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

export { registerUser, loginUser };
