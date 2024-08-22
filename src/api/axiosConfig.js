import axios from "axios";

const BASE_URL = 'http://localhost:3000/api'

const Api = axios.create({baseURL:BASE_URL,withCredentials:true});

export default Api; 