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
        (injectedAccounts) => {
          setAccounts(injectedAccounts);

          if (!injectedAccounts?.length) {
            setErrorMessage("No accounts found.");
            setStatus(null);
            return;
          }

          setStatus(STATUS.READY);

          if (!currentAccountAddress && injectedAccounts[0]?.address) {
            setCurrentAccountAddress(injectedAccounts[0].address);
            setErrorMessage(null);
          } else {
            fetchInjector(injectedAccounts);
          }
        }
      );
      return unsubscribeAccounts;
    } catch (error) {
      handleError(error, "subscribing to accounts");
    }
  };

  const fetchInjector = async (accounts: InjectedAccountWithMeta[]) => {
    if (!accounts?.length || !currentAccountAddress) {
      setErrorMessage("No accounts found to get injector.");
      setInjector(null);
      return;
    }

    try {
      const { web3FromSource } = await import("@polkadot/extension-dapp");
      const currentAccount = accounts.find(
        (account) => account.address === currentAccountAddress
      );

      if (!currentAccount) {
        setErrorMessage("No account found to get injector.");
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

    try {
      setAccounts(null);
      setCurrentAccountAddress(null);
      setInjector(null);
      setStatus(null);
    } catch (error) {
      handleError(error, "disconnecting wallet");
    }
  };

  useEffect(() => {
    if (currentAccountAddress && accounts) {
      fetchInjector(accounts);
    } else {
      setInjector(null);
    }
  }, [currentAccountAddress]);

  return {
    status,
    errorMessage,
    injectedExtensions,
    accounts,
    currentAccountAddress,
    setCurrentAccountAddress,
    injector,
    connectWallet,
    disconnectWallet,
  };
}
