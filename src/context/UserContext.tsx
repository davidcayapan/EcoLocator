import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'guest' | 'horeca' | 'facility';

interface UserContextType {
  userRole: UserRole | null;
  userName: string | null;
  companyName: string | null;
  facilityName: string | null;
  email: string | null;
  updateUserData: () => void;
}

const UserContext = createContext<UserContextType>({
  userRole: null,
  userName: null,
  companyName: null,
  facilityName: null,
  email: null,
  updateUserData: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<Omit<UserContextType, 'updateUserData'>>({
    userRole: null,
    userName: null,
    companyName: null,
    facilityName: null,
    email: null,
  });

  const updateUserData = () => {
    const storedRole = localStorage.getItem('userRole') as UserRole | null;
    const email = localStorage.getItem('tempEmail');
    const userName = localStorage.getItem('userName');
    const companyName = localStorage.getItem('companyName');
    const facilityName = localStorage.getItem('facilityName');

    setUserData({
      userRole: storedRole,
      userName: userName || null,
      companyName: companyName || null,
      facilityName: facilityName || null,
      email: email || null,
    });
  };

  useEffect(() => {
    updateUserData();
  }, []); // Run on mount

  const contextValue = {
    ...userData,
    updateUserData,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};