import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { BroadcastChannel } from 'broadcast-channel';

import { ApiContext } from './api'

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const history = useHistory();
  const logoutChannel = useMemo(() => new BroadcastChannel('logout'), []);
  const { checkAuthStatus, logout: logoutUser } = useContext(ApiContext);
  const [authState, setAuthState] = useState({
    userInfo: null,
    isAuthenticated: false
  });

  useEffect(() => {
    const fetchAndUpdateUser = async () => {
      try {
        const { user } = await checkAuthStatus();
        setAuthState({
          userInfo: user,
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

  useEffect(() => {
    logoutChannel.onmessage = message => {
      if (message === 'logOutAllTabs') {
        setAuthState({
          userInfo: {},
          isAuthenticated: false
        })
      }
    }

    return logoutChannel.close;
  }, [logoutChannel]);

  const setAuthInfo = ({ userInfo }) => {
    setAuthState({
      userInfo,
      isAuthenticated: Boolean(userInfo && userInfo.pelotonUserId)
    });
  }

  const logout = async () => {
    try {
      await logoutUser();
      setAuthState({
        userInfo: {},
        isAuthenticated: false
      })
      logoutChannel.postMessage('logOutAllTabs');
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
