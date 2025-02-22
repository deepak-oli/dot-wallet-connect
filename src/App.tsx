import { useWalletContext } from "@/hooks/useWalletContext";
import { STATUS } from "@/constants";

import "./App.css";
import ErrorMessage from "@/components/ErrorMessage";
import ConnectWallet from "@/components/Home/WalletConnect";
import AccountSelector from "@/components/Home/AccountSelector";
import WalletInfo from "@/components/Home/WalletInfo";

function App() {
  const {
    status,
    accounts,
    saveCurrentAccountAddress,
    currentAccountAddress,
    currentAccount,
    connectWallet,
    disconnectWallet,
    errorMessage,
  } = useWalletContext();

  if (status !== STATUS.READY) {
    return (
      <main className="container">
        <ConnectWallet
          connectWallet={connectWallet}
          isLoading={status === STATUS.LOADING}
        />
      </main>
    );
  }
  return (
    <main className="container">
      <div className="wallet-card">
        <h1 className="wallet-title">Polkadot Wallet</h1>

        {accounts && accounts.length > 0 && (
          <AccountSelector
            accounts={accounts}
            saveCurrentAccountAddress={saveCurrentAccountAddress}
            currentAccountAddress={currentAccountAddress}
          />
        )}

        {currentAccount && <WalletInfo currentAccount={currentAccount} />}
        <button
          onClick={disconnectWallet}
          className="wallet-button wallet-button--disconnect"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>

          <span>Disconnect Wallet</span>
        </button>

        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
      </div>
    </main>
  );
}

export default App;
