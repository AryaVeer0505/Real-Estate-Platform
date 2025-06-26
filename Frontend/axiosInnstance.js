import axios from 'axios'
const instance=axios.create({
    baseURL:"https://real-estate-platform-backend.onrender.com",
    timeout:30000,
})

// Request interceptors 
// interceptor is a feature in axios used to modify the requests and responses 
// it works like an middleware, means it executes before and after every responses and requests 

instance.interceptors.request.use(
    async(config)=>{
        try{
        const token=localStorage.getItem('token')
        console.log(token)
        config.headers.authorization=`Bearer ${token}`
        return config
        }
        catch(error){
            console.log(error)
        }
    }
)

// Response Interceptor 

instance.interceptors.response.use(
    (response)=>{
        console.log("Response data:",response.data)
        return response
    },
    (error)=>{
        console.log("response error:",error)
    }
)
export default instance

