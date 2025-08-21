import axios from 'axios';
import { getToken } from '../utils/storage';

const api = axios.create({
    baseURL: 'https://smartdocai-backend.azurewebsites.net/api'
    //baseURL: 'http://192.168.139.136:5000/api',
    //baseURL: 'http://192.168.58.136:5000/api',
    //baseURL: 'http://192.168.58.136:5200/api',
    // headers:{
    //     'content-type':'application/json'
    // }
});

api.interceptors.request.use(async (config)=>{
    const token = await getToken("authtoken");
    if(token)
    {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;