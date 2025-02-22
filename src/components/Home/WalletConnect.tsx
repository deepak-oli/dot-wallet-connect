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
      Connect Wallet
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
