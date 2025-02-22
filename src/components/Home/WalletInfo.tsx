import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

interface WalletInfoProps {
  currentAccount: InjectedAccountWithMeta | null;
}

const WalletInfo: React.FC<WalletInfoProps> = ({ currentAccount }) => (
  <div className="wallet-info">
    <p>
      Wallet Name:{" "}
      <span id="wallet-name-value">{currentAccount?.meta?.name}</span>
    </p>
    <p>
      Address: <span id="wallet-address-value">{currentAccount?.address}</span>
    </p>
  </div>
);

export default WalletInfo;
