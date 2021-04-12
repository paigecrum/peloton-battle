import React, { createContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';

import { checkAuthStatus, logout as logoutUser } from '../utils/api'

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const history = useHistory();
  const [authState, setAuthState] = useState({
    userInfo: null,
    isAuthenticated: false
  });

  useEffect(() => {
      checkAuthStatus()
        .then(({ user }) => {
          setAuthState({
            userInfo: user,
            isAuthenticated: true
          })
        })
        .catch((err) => {
          setAuthState({
            userInfo: {},
            isAuthenticated: false
          })
        })
  }, [])

  const setAuthInfo = ({ userInfo }) => {
    setAuthState({
      userInfo,
      isAuthenticated: userInfo && userInfo.pelotonUserId ? true : false
    });
  }

  const logout = () => {
    logoutUser()
      .then((data) => {
        setAuthState({
          userInfo: {},
          isAuthenticated: false
        })
        history.push('/');
      })
      .catch((err) => {
        console.log('Error logging out: ', err);
      })
  }

  return (
    <Provider
      value={{
        authState,
        setAuthState: (authInfo) => setAuthInfo(authInfo),
        logout
      }}
    >
      { children }
    </Provider>
  )
}

export { AuthContext, AuthProvider };
