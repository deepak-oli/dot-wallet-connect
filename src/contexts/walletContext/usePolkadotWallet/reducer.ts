import { Actions, ActionTypes } from "./actions";
import { IState } from "./types";

export function reducer(state: IState, action: Actions): IState {
  switch (action.type) {
    case ActionTypes.SET_STATUS:
      return { ...state, status: action.payload };
    case ActionTypes.SET_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload };
    case ActionTypes.SET_INJECTED_EXTENSIONS:
      return { ...state, injectedExtensions: action.payload };
    case ActionTypes.SET_ACCOUNTS:
      return { ...state, accounts: action.payload };
    case ActionTypes.SET_CURRENT_ACCOUNT_ADDRESS:
      return { ...state, currentAccountAddress: action.payload };
    case ActionTypes.SET_INJECTOR:
      return { ...state, injector: action.payload };
    default:
      return state;
  }
}
