import {
  InjectedAccountWithMeta,
  InjectedExtension,
} from "@polkadot/extension-inject/types";
import { Status } from "./types";

export const ActionTypes = {
  SET_STATUS: "SET_STATUS",
  SET_ERROR_MESSAGE: "SET_ERROR_MESSAGE",
  SET_INJECTED_EXTENSIONS: "SET_INJECTED_EXTENSIONS",
  SET_ACCOUNTS: "SET_ACCOUNTS",
  SET_CURRENT_ACCOUNT_ADDRESS: "SET_CURRENT_ACCOUNT_ADDRESS",
  SET_INJECTOR: "SET_INJECTOR",
} as const;

const setStatus = (status: Status | null) => ({
  type: ActionTypes.SET_STATUS,
  payload: status,
});

const setErrorMessage = (errorMessage: string | null) => ({
  type: ActionTypes.SET_ERROR_MESSAGE,
  payload: errorMessage,
});

const setInjectedExtensions = (
  injectedExtensions: InjectedExtension[] | null
) => ({
  type: ActionTypes.SET_INJECTED_EXTENSIONS,
  payload: injectedExtensions,
});

const setAccounts = (accounts: InjectedAccountWithMeta[] | null) => ({
  type: ActionTypes.SET_ACCOUNTS,
  payload: accounts,
});

const setCurrentAccountAddress = (address: string | null) => ({
  type: ActionTypes.SET_CURRENT_ACCOUNT_ADDRESS,
  payload: address,
});
const setInjector = (injector: InjectedExtension | null) => ({
  type: ActionTypes.SET_INJECTOR,
  payload: injector,
});

export const actions = {
  setStatus,
  setErrorMessage,
  setInjectedExtensions,
  setAccounts,
  setCurrentAccountAddress,
  setInjector,
};
export type Actions = ReturnType<(typeof actions)[keyof typeof actions]>;
export default actions;
