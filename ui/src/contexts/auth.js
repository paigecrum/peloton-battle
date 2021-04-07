import React, { createContext, useState } from 'react'

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    pelotonUsername: null,
    pelotonUserId: null,
    pelotonAvatarUrl: null,
    expiresAt: null,
    setAuthState: (authInfo) => setAuthInfo(authInfo)
  });

  const setAuthInfo = ({ user, expiresAt }) => {
    setAuthState({
      pelotonUserId: user.id,
      pelotonUsername: user.username,
      pelotonAvatarUrl: user.avatarUrl,
      expiresAt: expiresAt
    })
  }

  const isAuthenticated = () => {
    if (!authState.pelotonUserId || !authState.expiresAt) {
      return false;
    }
    return (
      new Date().getTime() / 1000 < authState.expiresAt
    );
  };

  const logout = () => {
    setAuthState({});
  }

  return (
    <Provider value={{authState, isAuthenticated, logout}}>
      { children }
    </Provider>
  )
}

export { AuthContext, AuthProvider };
