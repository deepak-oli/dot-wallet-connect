import { useEffect, useState } from "react";
import {
  InjectedAccountWithMeta,
  InjectedExtension,
} from "@polkadot/extension-inject/types";
import { documentReadyPromise } from "@/utils/shared";
import { APP_NAME } from "@/constants";

export const STATUS = {
  READY: "ready",
  NO_EXTENSION: "no_extension",
  ERROR: "error",
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS] | null;

export default function usePolkadotExtension() {
  const [status, setStatus] = useState<Status>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [injectedExtensions, setInjectedExtensions] = useState<
    InjectedExtension[] | null
  >(null);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[] | null>(
    null
  );
  const [currentAccountAddress, setCurrentAccountAddress] = useState<
    string | null
  >(null);
  const [injector, setInjector] = useState<InjectedExtension | null>(null);

  const handleError = (error: unknown, context: string) => {
    const errorMessage = `Error ${context}: ${
      error instanceof Error ? error.message : String(error)
    }`;
    // console.error(errorMessage);
    setStatus(STATUS.ERROR);
    setErrorMessage(errorMessage);
  };

  const connectExtension = async () => {
    try {
      const { web3Enable } = await import("@polkadot/extension-dapp");
      const extensions = await documentReadyPromise(() => web3Enable(APP_NAME));
      if (!extensions?.length) {
        setStatus(STATUS.NO_EXTENSION);
        setInjector(null);
        setErrorMessage("No injected extensions found.");
        return;
      }

      setInjectedExtensions(extensions);
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
          setAccounts(injectedAccounts);

          if (!injectedAccounts?.length) {
            setErrorMessage("No connected accounts found.");
            setStatus(STATUS.READY);
            handleCurrentAccountSave(null);
            return;
          }

          const savedAddress = localStorage.getItem("currentAccountAddress");
          const savedAccount = injectedAccounts.findIndex(
            (account) => account.address === savedAddress
          );
          const isSavedAccountValid = savedAccount !== -1;

          let accountAddress;

          if (isSavedAccountValid) {
            accountAddress = savedAddress!;
          } else {
            accountAddress =
              currentAccountAddress || injectedAccounts[0]?.address;
          }

          handleCurrentAccountSave(accountAddress);
          setErrorMessage(null);

          await fetchInjector(injectedAccounts, accountAddress);

          setStatus(STATUS.READY);
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
      setInjector(null);
      return;
    }

    try {
      const { web3FromSource } = await import("@polkadot/extension-dapp");
      const currentAccount = accounts.find(
        (account) => account.address === selectedAddress
      );

      if (!currentAccount) {
        setErrorMessage("No connected account found to get injector.");
        return;
      }

      const newInjector = await web3FromSource(currentAccount.meta.source);
      setInjector(newInjector);
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
    if (status !== STATUS.READY) {
      return;
    }
    setAccounts(null);
    handleCurrentAccountSave(null);
    setInjector(null);
    setStatus(null);
  };

  const handleCurrentAccountSave = (address: string | null) => {
    if (address) {
      localStorage.setItem("currentAccountAddress", address);
    } else {
      localStorage.removeItem("currentAccountAddress");
    }
    setCurrentAccountAddress(address);
  };

  useEffect(() => {
    const savedCurrentAccountAddress = localStorage.getItem(
      "currentAccountAddress"
    );

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

  useEffect(() => {
    fetchInjector(accounts ?? [], currentAccountAddress!);
  }, [currentAccountAddress]);

  const currentAccount = accounts?.find(
    (account) => account.address === currentAccountAddress
  );
  return {
    status,
    errorMessage,
    injectedExtensions,
    accounts,
    currentAccountAddress,
    handleCurrentAccountSave,
    currentAccount,
    injector,
    connectWallet,
    disconnectWallet,
  };
}
