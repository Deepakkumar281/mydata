import { AxiosResponse } from "axios";
import { LoginRequest } from "../models/api/authTypes";
import { LoginResponse } from "../models/api/loginResponse";
import { ListRequest } from "../models/common/listRequest";
import { ListResponse } from "../models/common/listResponse";
import BaseApi from "./base";


export default class TemplateApi extends BaseApi {
  post(arg0: string, data: { content_type: string; }) {
    throw new Error('Method not implemented.');
  }
    constructor() {
        super()
    }

    templateList = (params?: ListRequest) : Promise<AxiosResponse<ListResponse<any>>> => (
        this.client.get(`ipss-forms/?results_per_page=100000`, {
            params
        })
    )
    addTemplate = (data: any) => (
        this.client.post(`ipss-forms/`, data)
    )
    EditTemplate = (data: any) => (
        this.client.post(`ipss-forms/`, data)
    )

    templateDetails = (form_id: number) => (
        this.client.get(`ipss-forms/${form_id}/`)
    )

    userdata = () => (
        this.client.get(`/ipss-forms/assets/user-assign-template/`)
    )
    submitForm = (form_id: number, data: any) => (
        this.client.post(`ipss-forms/submissions/${form_id}/`, data)
    )
    /* get the site list */
    GetSiteList = () => (
        this.client.get(`/ipss-forms/assets/?results_per_page=10000`)
    )
    VehiclelistData = (aid: number) => (
        this.client.get(`ipss-forms/assets/?parent_id=${aid}&results_per_page=10000`)
    )
/* Meganic Vehicle list */
    MacVehiclelistData = () => (
        this.client.get(`ipss-forms/tickets/asset-list?results_per_page=10000`)
    )
 /* status data list */
 StatustData = () => (
    this.client.get(`ipss-forms/tickets/status-list`)
)
/* complaint details */
ComplaintData = (asset_id :number) => (
    this.client.get(`/ipss-forms/tickets/ticket-list/${asset_id}`)
)
/* submit mechanic data */

submitMecForm = (asset_id: number, data: any) => (
    this.client.post(`ipss-forms/tickets/update-ticket/${asset_id}/`, data)
)
/* Non GPS Vehicle Megha */
GPSVehicleData = () => (
    this.client.get(`/ipss-forms/assets/?vehicle_group=NonGps&results_per_page=10000`)
)
/* Bunk list Api */
BunkListData = () => (
    this.client.get(`/ipss-forms/assets/fuel-station-list`)
)
TankerListData = () => (
    this.client.get(`/ipss-forms/assets/?vehicle_group=Tanker`)
)

/* Fuel filling Submit api */
FuelFillingSubmit = (tempid:any,data :any) => (
    this.client.post(`/ipss-forms/submissions/${tempid}/`,data)
)

MeghaGPSVehicleData = () => (
    this.client.get(`/ipss-forms/assets/?vehicle_group=Gps&results_per_page=10000`)
)
MeghaFuelFillingSubmit = (tempid:any,data :any) => (
    this.client.post(`/ipss-forms/submissions/${tempid}/`,data)
)

PreviousSubmitData = (aid:any) =>(
    this.client.get(`ipss-forms/previous-submission/${aid}/`)
)
/* History OF Submission */
HistorySub = () =>(
    this.client.get("/ipss-forms/user-submissions/")
)
/* History summary */
HistoryDetails = (submissionId:number,formId:number) =>(
    
    this.client.get( `/ipss-forms/user-submissions/${submissionId}/${formId}/`)
)
/* odeo meter data */

OdometerData = (asset_id:number) =>(
    
    this.client.get( `/ipss-forms/assets/odometer/${asset_id}`)
)
/* user asset vehicle */
UserGPSVehicleData = () => (
    this.client.get(`/ipss-forms/assets/user-assets?vehicle_group=Gps&results_per_page=10000`)
)
UsernonGPSVehicleData = () => (
    this.client.get(`/ipss-forms/assets/user-assets?vehicle_group=NonGps&results_per_page=10000`)
)

FuelFillingVehicles = (site_group: string) => (
    this.client.get(`/ipss-forms/assets/user-assets?site_group=${site_group}&results_per_page=10000`)
)

ImageUploader = (data:any) =>
 (   this.client.post(`/ipss-forms/users/upload-s3-data/`,data))
 UserDataGet = () => 
(this.client.get(`/ipss-forms/userlist/?results_per_page=10000`))

FormDataGet = () => 
(this.client.get(`/ipss-forms/?results_per_page=1000`))


AssignGet = () => 
(this.client.get(`/ipss-forms/assets/user-assign-template/`))

FormAssignGet = (user_id:number) => 
(this.client.get (`/ipss-forms/assets/user-assign-template/?user_id=${user_id}`))

UserAssignGet = (form_id:number) => 
(this.client.get (`/ipss-forms/assets/user-assign-template/?form_id=${form_id}`))

AssignTemplatePost = (data: any) =>
(this.client.post(`ipss-forms/assets/user-assign-template/`, data))
assesttype = (asset_type:string) =>
(this.client.get (`/ipss-forms/assets/?asset_type=${asset_type}`))
assesttype1 = (asset_type:string) =>
(this.client.get (`/ipss-forms/assets/?asset_type=${373}`))
actiontracker = () =>
(this.client.get (`/action_tracker_hrm/?module_type=Compliance`))
customaction = () =>
(this.client.get (`/customer_action/`))
patchcustomaction = (action_tracker_id:any,data:any) =>
(this.client.patch (`/action_tracker_hrm/${action_tracker_id}/`, data))
getcustomaction = (action_tracker_id:any) =>
(this.client.get (`/action_tracker_hrm/?module_type=Compliance/${action_tracker_id}/`))
actiontrackerfilter = () =>
(this.client.get (`/action_tracker_hrm/?status=`))
actionstage = (New: any) => (
    this.client.get(`/action_tracker_hrm/?status=${New}`)
)
dynamicApi = (path: any) => this.client.get(`${path}`);
Actionstage=()=>(
    this.client.get(`/customer_action/`)
  )
  //Actiontracker stage details get
  Actiondetails=()=>(
    this.client.get(`/action_tracker_hrm/?module_type=Pentagon`)
  )
  PatchCard=(add_lead_id:number, data:any)=>(
    this.client.patch(`/kanban_board/${add_lead_id}/`, data)
  )
  Actionedit=(action_tracker_id:number,data:any)=>(
    this.client.patch(`/action_tracker_hrm/${action_tracker_id}/`,data)
  )
}  