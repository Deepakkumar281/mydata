import axios, { AxiosResponse } from "axios";
import { LoginRequest } from "../models/api/authTypes";
import { LoginResponse } from "../models/api/loginResponse";
import BaseApi from "./base";
import ApiConfig from "../config/api-config";


export default class IdmApi extends BaseApi {
    constructor() {
        super()
    }

    login = (data: LoginRequest) : Promise<AxiosResponse<LoginResponse>> => (
        this.client.post(`users/login`, data)
    )

    logout = () : Promise<AxiosResponse> => (
        this.client.post(`/idm/logout/`)
    )
    checkAppUpdates = (app_identifier: string) => (
        this.client.get(`ipss-forms/assets/?asset_type=AppRelease&asset_identifier=${app_identifier}`)
    )

    // changepassword = (data: any) => (
    //     this.client.patch(`users/update-profile/`, data)
    // )
    changepassword =(data:any)=>{
          const config = {
            method : "patch",
            url : `${ApiConfig.BASE_URL}/users/update-profile/`,
            headers : {
                'Authorization' : this.user.loggedIn ? `Bearer ${this.user.access_token}` : "",
              
                'Content-type' : "application/json",

            },
            data : data
          }

          console.log(config)
          return axios(config)
        }

    getUserRoles = (token: string) : Promise<AxiosResponse<any>> => (
        this.client.get(`/ipss-forms/users/user-roles`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    )
}