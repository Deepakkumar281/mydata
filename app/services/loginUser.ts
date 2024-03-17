import apiClient from "./client";
import ApiConfig from "../config/api-config";
import { LoginResponse } from "../models/api/loginResponse";
import { AxiosPromise } from "axios";

// export default function loginUser(username: string, password: string) {
//   return apiClient.post(ApiConfig.LOGIN, { username, password });
// }

export const loginUser = async (username: string, password: string) => {
  try {
    let url = ApiConfig.LOGIN
    const user = await apiClient.post<LoginResponse>(url, {username, password});
    console.log("bala check Login Response +++++++--->", user);
    // console.log("challengeName-->", user.challengename);
    return user; 
  } catch (error) {
    console.log("error signing in", error);
    return error;
  }
}