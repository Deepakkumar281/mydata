import {
    SET_CURRENT_USER,
    DELETE_CURRENT_USER,
    SetCurrentUser,
    DeleteCurrentUser,
    CHANGE_ACCESS_TOKEN,
    changeAccessToken,
  } from '../actions';
  import {UserData, ChangeAccessTokenAction} from '../actions';
  
  const initialState: UserData = {
    loggedIn: false,
    user_roles: {} as any,
    userRoles: [],
    user: {} as any,
    success: false,
    access_token: '',
    message: '',
  };
  
  const userReducer = (
    state = initialState,
    action: SetCurrentUser | DeleteCurrentUser | ChangeAccessTokenAction,
  ) => {
    switch (action.type) {
      case SET_CURRENT_USER:
        return {...state, ...action.user};
      case DELETE_CURRENT_USER:
        return initialState;
      case CHANGE_ACCESS_TOKEN:
        return {...state, access_token: action.access_token};
      default:
        return state;
    }
  };
  
  export default userReducer;
  