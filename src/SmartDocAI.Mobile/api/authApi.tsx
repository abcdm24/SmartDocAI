import api from "./axios";

export async function login(email: string, password: string) {
  console.log(`Calling WebAPI Auth/Login email:${email}, password:${password}`);
  try {
    const response = await api.post(`auth/login`, { email, password });
    return response.data;
  } catch (err) {
    console.log(`Error:${err}`);
  }
}

export async function register(name: string, email: string, password: string) {
  const response = await api.post(`auth/register`, { name, email, password });
  return response.data;
}
