import { ReactNode } from "react";

import usePolkadotWallet from "@/contexts/walletContext/usePolkadotWallet";
import { WalletContext } from ".";

export type WalletState = ReturnType<typeof usePolkadotWallet>;

export default function WalletProvider({ children }: { children: ReactNode }) {
  const value = usePolkadotWallet();

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
