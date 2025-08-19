import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, 
    //baseURL: 'http://192.168.58.136:5000/api/documents',
    //baseURL: 'http://192.168.58.136:5000/api',
    //baseURL: 'http://192.168.58.136:5200/api',
    // headers:{
    //     'content-type':'application/json'
    // }
});

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("jwtToken");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;