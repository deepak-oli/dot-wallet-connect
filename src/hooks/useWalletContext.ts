import { useContext } from "react";
import { WalletState } from "@/contexts/walletContext/provider";
import { WalletContext } from "@/contexts/walletContext";

export const useWalletContext = (): WalletState => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error(
      "usePolkadotWalletContext must be used within a WalletProvider"
    );
  }
  return context;
};
