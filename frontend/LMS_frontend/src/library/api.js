import axios from 'axios';
console.log("CURRENT API URL IS:", import.meta.env.VITE_API_URL);

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const syncUserWithMongoDb = async (User)=>{
  try{
    const response = await API.post('/user/sync',{
      supabase_id: User.id,
      email: User.email,
      name: User.user_metadata.fullname || User.email.split('@')[0],
    });
    return response.data;
  }catch (error){
    console.log("connection to backend failed",error.response?.data || error.message);
  }
}