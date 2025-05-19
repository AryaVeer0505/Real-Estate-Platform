import axios from 'axios'
const axiosInstance=axios.create({
    baseURL:"http://localhost:5001",
    timeout:1000,
})

// Request interceptors 
// interceptor is a feature in axios used to modify the requests and responses 
// it works like an middleware, means it executes before and after every responses and requests 


axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      console.log("📦 Token from localStorage:", token); 
  
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log("✅ Auth header set:", config.headers['Authorization']);
      } else {
        console.warn("⚠️ No token found in localStorage.");
      }
  
      return config;
    },
    (error) => {
      console.error("❌ Axios request error:", error);
      return Promise.reject(error);
    }
  );
  

// Response Interceptor 

axiosInstance.interceptors.response.use(
    (response)=>{
        console.log("Response data:",response.data)
        return response
    },
    (error)=>{
        console.log("response error:",error)
    }
)
export default axiosInstance