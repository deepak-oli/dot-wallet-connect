import { STATUS } from "@/constants";
import {
  InjectedAccountWithMeta,
  InjectedExtension,
} from "@polkadot/extension-inject/types";

export type Status = (typeof STATUS)[keyof typeof STATUS] | null;

export interface IState {
  status: Status | null;
  errorMessage: string | null;
  injectedExtensions: InjectedExtension[] | null;
  accounts: InjectedAccountWithMeta[] | null;
  currentAccountAddress: string | null;
  injector: InjectedExtension | null;
}
