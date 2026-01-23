import axios from "../../axios.customize";

const registerApi = (fullName, email, password) => {
  const URL_BACKEND = "/api/auth/register";
  const data = {
    fullName,
    email: email,
    password,
  };
  return axios.post(URL_BACKEND, data);
};

export default registerApi;
