import { useState } from "react";

export const useLocalStorage = (
  keyName: string,
  defaultValue: string | null
) => {
  /*
    To maintain the user’s state even after a page refresh.
    Custom hook to get or set "user" authentication credential in window's localstorage
   */
  const [storedValue, setStoredValue] = useState(
    // callback function to compute the initial storedValue.
    // initial value defaults to null
    () => {
      try {
        const value = window.localStorage.getItem(keyName);
        if (value) {
          return JSON.parse(value);
        } else {
          window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
          return defaultValue;
        }
      } catch (err) {
        return defaultValue;
      }
    }
  );

  const setValue = (newValue: any) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {
      console.log(err);
    }
    setStoredValue(newValue);
  };
  return [storedValue, setValue];
};
