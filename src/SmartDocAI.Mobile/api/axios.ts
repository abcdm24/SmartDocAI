import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.58.136:5000/api/documents',
    // headers:{
    //     'content-type':'application/json'
    // }
});

export default api;