import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

interface AccountSelectorProps {
  accounts: InjectedAccountWithMeta[];
  saveCurrentAccountAddress: (address: string) => void;
  currentAccountAddress: string | null;
}

const AccountSelector: React.FC<AccountSelectorProps> = ({
  accounts,
  saveCurrentAccountAddress,
  currentAccountAddress,
}) => (
  <div className="dropdown">
    <label htmlFor="accounts" className="dropdown-label">
      Select an account:
    </label>
    <select
      id="accounts"
      className="dropdown-select"
      onChange={(e) => saveCurrentAccountAddress(e.target.value)}
      value={currentAccountAddress || ""}
    >
      <option disabled value="">
        Select
      </option>
      {accounts?.map((account) => (
        <option key={account.address} value={account.address}>
          {account.meta.name}
        </option>
      ))}
    </select>
  </div>
);

export default AccountSelector;
