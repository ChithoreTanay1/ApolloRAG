import axios from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000",
  headers: {
    Accept: "application/json",
  },
});

export default client;
