import { AxiosResponse } from "axios";
import BaseApi from "./base";


export default class WorkOrderApi extends BaseApi {
    constructor() {
        super()
    }

    companyProperties = () : Promise<AxiosResponse<any>> => (
        this.client.get(`company/properties`)
    )
}