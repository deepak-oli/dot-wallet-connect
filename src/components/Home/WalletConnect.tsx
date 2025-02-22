import React from "react";

interface ConnectWalletProps {
  connectWallet: () => void;
  isLoading: boolean;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({
  connectWallet,
  isLoading,
}) => (
  <div className="wallet-card">
    <h2 className="wallet-title">Polkadot Wallet</h2>
    <button
      className="wallet-button"
      onClick={connectWallet}
      disabled={isLoading}
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
          d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
        />
      </svg>
      <span>Connect Wallet</span>
    </button>
    <p>
      Install the{" "}
      <a
        href="https://polkadot.js.org/extension/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Polkadot
      </a>{" "}
      extension to connect your wallet.
    </p>
  </div>
);

export default ConnectWallet;
