import { refreshTokenApi } from "@/features/Auth/api/auth.api"
import axios, { AxiosError } from "axios"

const apiClient = axios.create({
    baseURL: "http://localhost:5000/api/v1",
    withCredentials: true
})
apiClient.interceptors.response.use(
    (response) => {
        return response
    },
    async (error: AxiosError) => {
        if(error.response?.status === 401) {
            try {
                await refreshTokenApi()
            } catch (error) {
                
            }
        }
        return Promise.reject(error)
    }
)


export default apiClient