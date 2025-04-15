import axios from 'axios'
const instance=axios.create({
    baseURL:"http://localhost:5001",
    timeout:1000,
})

// Request interceptors 
// interceptor is a feature in axios used to modify the requests and responses 
// it works like an middleware, means it executes before and after every responses and requests 

instance.interceptors.request.use(
    async(config)=>{
        try{
        const token=localStorage.getItem('token')
        config.headers.Authorization=`Bearer ${token}`
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