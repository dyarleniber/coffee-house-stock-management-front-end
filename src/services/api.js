import axios from "axios";
import apiConfig from "../config/api";

const { baseURL } = apiConfig;

const api = axios.create({
  baseURL,
});

export default api;
