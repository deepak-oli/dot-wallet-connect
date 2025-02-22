import { useEffect, useReducer } from "react";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { documentReadyPromise } from "@/utils/shared";
import { APP_NAME, STATUS } from "@/constants";
import accountStorage from "@/utils/accountStorage";
import { IState } from "./types";
import { reducer } from "./reducer";
import actions from "./actions";

const initialState: IState = {
  status: null,
  errorMessage: null,
  injectedExtensions: null,
  accounts: null,
  currentAccountAddress: null,
  injector: null,
};

export default function usePolkadotWallet() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleError = (error: unknown, context: string) => {
    const errorMessage = `Error ${context}: ${
      error instanceof Error ? error.message : String(error)
    }`;
    dispatch(actions.setStatus(STATUS.ERROR));
    dispatch(actions.setErrorMessage(errorMessage));
  };

  const connectExtension = async () => {
    try {
      const { web3Enable } = await import("@polkadot/extension-dapp");
      const extensions = await documentReadyPromise(() => web3Enable(APP_NAME));
      if (!extensions?.length) {
        dispatch(actions.setStatus(STATUS.NO_EXTENSION));
        dispatch(actions.setInjectedExtensions(null));
        dispatch(actions.setErrorMessage("No injected extensions found."));
        return;
      }

      dispatch(actions.setInjectedExtensions(extensions));
    } catch (error) {
      handleError(error, "loading Polkadot extensions");
    }
  };

  const subscribeAccounts = async () => {
    try {
      const { web3AccountsSubscribe } = await import(
        "@polkadot/extension-dapp"
      );

      const unsubscribeAccounts = await web3AccountsSubscribe(
        async (injectedAccounts) => {
          dispatch(actions.setAccounts(injectedAccounts));
          if (!injectedAccounts?.length) {
            dispatch(actions.setErrorMessage("No connected accounts found."));
            dispatch(actions.setStatus(STATUS.READY));
            saveCurrentAccountAddress(null);

            return;
          }

          const savedAddress = accountStorage.getAddress();
          const savedAccount = injectedAccounts.findIndex(
            (account) => account.address === savedAddress
          );
          const isSavedAccountValid = savedAccount !== -1;

          let accountAddress;

          if (isSavedAccountValid) {
            accountAddress = savedAddress!;
          } else {
            accountAddress =
              state.currentAccountAddress || injectedAccounts[0]?.address;
          }

          saveCurrentAccountAddress(accountAddress);
          dispatch(actions.setErrorMessage(null));

          await fetchInjector(injectedAccounts, accountAddress);

          dispatch(actions.setStatus(STATUS.READY));
        }
      );
      return unsubscribeAccounts;
    } catch (error) {
      handleError(error, "subscribing to accounts");
    }
  };

  const fetchInjector = async (
    accounts: InjectedAccountWithMeta[],
    selectedAddress: string
  ) => {
    if (!accounts?.length || !selectedAddress) {
      dispatch(actions.setInjector(null));
      return;
    }
    try {
      const { web3FromSource } = await import("@polkadot/extension-dapp");
      const currentAccount = accounts.find(
        (account) => account.address === selectedAddress
      );

      if (!currentAccount) {
        dispatch(
          actions.setErrorMessage("No connected account found to get injector.")
        );
        return;
      }

      const newInjector = await web3FromSource(currentAccount.meta.source);
      dispatch(actions.setInjector(newInjector));
    } catch (error) {
      handleError(error, "getting injector");
    }
  };

  const connectWallet = async () => {
    await connectExtension();
    const unsubscribeAccounts = await subscribeAccounts();
    return unsubscribeAccounts;
  };

  const disconnectWallet = async () => {
    if (state.status !== STATUS.READY) {
      return;
    }
    saveCurrentAccountAddress(null);
    dispatch(actions.setAccounts(null));
    dispatch(actions.setInjector(null));
    dispatch(actions.setStatus(null));
  };

  const saveCurrentAccountAddress = (address: string | null) => {
    if (address) {
      accountStorage.saveAddress(address);
    } else {
      accountStorage.removeAddress();
    }

    dispatch(actions.setCurrentAccountAddress(address));

    fetchInjector(state.accounts ?? [], address!);
  };

  useEffect(() => {
    const savedCurrentAccountAddress = accountStorage.getAddress();
    if (!savedCurrentAccountAddress) return;

    let unsubscribe: undefined | (() => void);

    const initWallet = async () => {
      unsubscribe = await connectWallet();
    };

    initWallet();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const currentAccount = state.accounts?.find(
    (account) => account.address === state.currentAccountAddress
  );

  return {
    status: state.status,
    errorMessage: state.errorMessage,
    injectedExtensions: state.injectedExtensions,
    accounts: state.accounts,
    currentAccountAddress: state.currentAccountAddress,
    injector: state.injector,
    saveCurrentAccountAddress,
    currentAccount,
    connectWallet,
    disconnectWallet,
  };
}
