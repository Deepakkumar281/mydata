import axios from "axios";
import ApiConfig from "../config/api-config";
// import * as RNLocalize from "react-native-localize";
import moment from "moment";

// const apiClient = axios.create({
//   baseURL: '/react-dev',
//   responseType: 'json',
//   withCredentials: true,
// });

// export { apiClient };

const apiClient = axios.create({
  baseURL: ApiConfig.BASE_URL,
});
apiClient.defaults.headers.post["Content-Type"] = "application/json";
// apiClient.defaults.headers.common['type'] = 'mobile';
// apiClient.defaults.headers.common['localTimeZone'] = RNLocalize.getTimeZone();

var datePicked = new Date();
var DateVar = moment(datePicked).format("YYYY-MM-DD hh:mm:ss");
console.log(DateVar);
// console.log(RNLocalize.getTimeZone());
// apiClient.defaults.headers.common['localTime'] = DateVar;

export default apiClient;

export const setAuth = (token: any) => {
  console.log("Header Token", token);
  apiClient.defaults.headers.Authorization = `${token}`;
  // apiClient.defaults.headers.Authorization = `Bearer ${token}`;
};

export const RemoveAuth = () => {
  delete apiClient.defaults.headers.Authorization;
};
