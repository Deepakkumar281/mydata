export interface LoginResponse {
  success: boolean;
  message: string;
  access_token: string;
  user: User;
  userRoles: string[];
  user_roles: {
    user_permissions: {
      CSFormSubmission: [string];
      GaMDashboard:[string];
      GatePass:[string];
    };
    user_roles: string[];
  };
}

export interface User {
  username: string;
  firstname: string;
  user_role: string;
  usersign: string;
  firstlogin: string;
  createdon: string;
  eviewtype: string;
  userip: string;
  userid: number;
  userphoto: string;
  emailid: string;
  lastname: string;
  projectid: number;
  usertype: string;
  rolename: string;
  countrycode: string;
  enabled: string;
  auvitid: string;
  status: boolean;
  mobilenumber: string;
  deleted: boolean;
}

export interface UserRoles {}
