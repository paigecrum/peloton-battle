import React, { createContext, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';

import { ApiContext } from './api'

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const history = useHistory();
  const { checkAuthStatus, logout: logoutUser } = useContext(ApiContext);
  const [authState, setAuthState] = useState({
    userInfo: null,
    isAuthenticated: false
  });

  useEffect(() => {
    const fetchAndUpdateUser = async () => {
      try {
        const { data } = await checkAuthStatus();
        setAuthState({
          userInfo: data.user,
          isAuthenticated: true
        })
      } catch (error) {
        setAuthState({
          userInfo: {},
          isAuthenticated: false
        })
      }
    }

    fetchAndUpdateUser();
  }, [checkAuthStatus])

  const setAuthInfo = ({ userInfo }) => {
    setAuthState({
      userInfo,
      isAuthenticated: userInfo && userInfo.pelotonUserId ? true : false
    });
  }

  const logout = async () => {
    try {
      await logoutUser();
      setAuthState({
        userInfo: {},
        isAuthenticated: false
      })
      history.push('/login');
    } catch (error) {
      console.log('Error logging out: ', error);
    }
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
