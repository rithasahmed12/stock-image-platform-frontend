import axios from "axios";

const BASE_URL = 'http://localhost:3000/api'

const Api = axios.create({baseURL:BASE_URL,withCredentials:true});

Api.interceptors.request.use(
    (config) => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;
  
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
  
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default Api; 