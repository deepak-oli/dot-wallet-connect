import usePolkadotExtension from "./hooks/usePolkadotExtension";

function App() {
  const {
    status,
    accounts,
    handleCurrentAccountSave,
    currentAccountAddress,
    currentAccount,
    connectWallet,
    disconnectWallet,
    errorMessage,
  } = usePolkadotExtension();

  if (status !== "ready") {
    return <button onClick={connectWallet}>Connect Wallet</button>;
  }
  return (
    <>
      <h1>Polkadot Extension Example</h1>
      <button onClick={disconnectWallet}>Disconnect Wallet</button>
      <br />
      <br />

      {accounts && accounts.length > 0 && (
        <select
          onChange={(e) => {
            handleCurrentAccountSave(e.target.value);
          }}
          value={currentAccountAddress || ""}
        >
          <option disabled value="">
            Select an account
          </option>
          {accounts?.map((account) => (
            <option key={account.address} value={account.address}>
              {account.meta.name}
            </option>
          ))}
        </select>
      )}

      {currentAccount && (
        <pre>{JSON.stringify(currentAccount, undefined, 2)}</pre>
      )}
      {errorMessage && <p>{errorMessage}</p>}
    </>
  );
}

export default App;
