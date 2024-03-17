import {LoginResponse} from '../../../models/api/loginResponse';

export const SET_CURRENT_USER = 'set_current_user';
export const DELETE_CURRENT_USER = 'delete_current_user';
export const CHANGE_ACCESS_TOKEN = 'CHANGE_ACCESS_TOKEN';

export interface UserData extends LoginResponse {
  loggedIn: boolean;
}

export interface SetCurrentUser {
  type: typeof SET_CURRENT_USER;
  user: UserData;
}

export interface DeleteCurrentUser {
  type: typeof DELETE_CURRENT_USER;
}
// actions.ts
export interface ChangeAccessTokenAction {
  type: typeof CHANGE_ACCESS_TOKEN;
  access_token: string;
}

export const changeAccessTokens = (newToken: string): ChangeAccessTokenAction => ({
  type: CHANGE_ACCESS_TOKEN,
  access_token: newToken,
});

export const setCurrentUser = (user: UserData): SetCurrentUser => ({
  type: SET_CURRENT_USER,
  user,
});

export const deleteCurrentUser = (): DeleteCurrentUser => ({
  type: DELETE_CURRENT_USER,
});
export const changeAccessToken = (newToken:any) => ({
  type: CHANGE_ACCESS_TOKEN,
  access_token: newToken,
});