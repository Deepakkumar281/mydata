import { Platform } from "react-native";
import {API_URL} from "@env"

/* App config for apis
 */

const ENV = {
  ISPRODCTION: false,
};


const ApiConfig = {
  BASE_URL: API_URL,
  IMAGE_URL: ENV.ISPRODCTION
    ? "https://api.prod.freshvoice.app/"
    : "https://api.dev.freshvoice.app/",
  VIDEO_BASE_URL: ENV.ISPRODCTION
    ? "https://cdn.freshvoice.app/"
    : "https://devcdn.freshvoice.app/",
  WEBSITE_URL: ENV.ISPRODCTION
    ? "https://freshvoice.app/"
    : "https://dev.freshvoice.in/",

  LOGIN: "users/login",
  DASHBOARD: "user/student-dashboard",
  ADD_TEMPLATE: "/ipss-forms/",
  LIST_TEMPLATES: "/ipss-forms/"
};

export default ApiConfig;
