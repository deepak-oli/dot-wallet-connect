import { createContext } from "react";

import WalletProvider, { WalletState } from "./provider";

export const WalletContext = createContext<WalletState | undefined>(undefined);

export default WalletProvider;
