export interface ILoginRequestState {
  type: string;
  username: string;
  password: string;
}

interface IResponse {
  id: number;
  token: string;
  data: object;
}

export interface ILoginResponseState {
  type: string;
  response: any;
}

export interface ISignUpRequestState {
  type: string;
  payload: any;
}

export interface ISignUpResponseState {
  type: string;
  response: any;
}
