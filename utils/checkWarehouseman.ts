import { getData } from './storage';

export const checkWarehouseman = async () => {
  const userString = await getData('warehouseman');
  if (userString) {
    return userString
  }
  return null;
};