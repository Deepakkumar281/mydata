import Axios, { AxiosInstance } from 'axios'
import ApiConfig from "../config/api-config";
import { UserState } from '../redux'
import {store} from '../EntryPoint'
import NavigationService from '../navigation/NavigationService';

export default class BaseApi {
    client: AxiosInstance
    user: UserState
    constructor(BASE_URL = ApiConfig.BASE_URL) {
        console.log("API URL", BASE_URL)
        this.user = store.store.getState().userReducer
        this.client = Axios.create({
            baseURL: BASE_URL,
            headers: {
                'Authorization': this.user.loggedIn ? `Bearer ${this.user.access_token}` : "",
                'Content-Type': 'application/json'
            } 
        })
        
        this.client.interceptors.response.use(
            response => response,
            error => {
                console.log(error.response)
                const { status } = error.response;
                console.log(status)
                if (401 === status || 403 === status) {
                    // DO SOMETHING
                    NavigationService.replace("Auth", {
                        screen: "Login"
                    })
                }
                return Promise.reject(error)
            }
        ) 
    } 
}