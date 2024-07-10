import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const signup = (email, password) => {
    return axios
        .post(API_URL + "/signup", {
            email,
            password,
        })
        .then((response) => {
            if (response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response.data;
        });
};

const login = (username, password) => {
    return axios
        .post(API_URL + "/login/", {
            username,
            password,
        })
        .then((response) => {
            if (response.data.access) {
                // console.log("Data is here?", response.data)

                localStorage.setItem("user", JSON.stringify(response.data));
            }
            // console.log(response.data.access )
            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem("user");
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const authService = {
    signup,
    login,
    logout,
    getCurrentUser,
};

export default authService;