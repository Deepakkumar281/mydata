import {SetScreenUpdated, SET_COMPCODE_UPDATED} from '../actions';

const initialState = {
  compcode: '',
};

const CompcodeReducer = (state = initialState, action: SetScreenUpdated) => {
  switch (action.type) {
    case SET_COMPCODE_UPDATED:
      return {...state, compcode: action.compcode};
    default:
      return state;
  }
};

export default CompcodeReducer;
