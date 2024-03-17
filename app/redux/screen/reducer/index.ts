import { SetScreenUpdated, SET_SCREEN_UPDATED } from "../actions";

const initialState = {
    screenName: ""
}

const screenReducer = (state = initialState, action: SetScreenUpdated) => {
    switch (action.type) {
        case SET_SCREEN_UPDATED:
            return {...state, screenName: action.screenName};
        default:
            return state
    }
}

export default screenReducer