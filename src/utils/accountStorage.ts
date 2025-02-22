const ADDRESS_STORAGE_KEY = "currentAccountAddress";

const saveAddress = (address: string) => {
  localStorage.setItem(ADDRESS_STORAGE_KEY, address);
};

const getAddress = () => {
  return localStorage.getItem(ADDRESS_STORAGE_KEY);
};

const removeAddress = () => {
  localStorage.removeItem(ADDRESS_STORAGE_KEY);
};

const accountStorage = {
  saveAddress,
  getAddress,
  removeAddress,
};

export default accountStorage;
