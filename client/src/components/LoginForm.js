import React, { useContext, useState } from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import { Box, Button, Form, FormField, Heading, TextInput } from 'grommet'

import { ErrorMessage } from './ErrorMessage'
import Loading from './Loading'
import { AuthContext } from '../contexts/auth'
import { ApiContext } from '../contexts/api'

export default function LoginForm() {
  const { authState, setAuthState } = useContext(AuthContext);
  const { authorize } = useContext(ApiContext);
  const { state } = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [redirectOnLogin, setRedirectOnLogin] = useState(false);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const data = await authorize(e.value);
      setAuthState(data);
      setRedirectOnLogin(true);
    } catch (error) {
      setLoginLoading(false);
      console.warn('Error authorizing user: ', error);
      setError('Peloton authentication failed with provided credentials. Please try again.');
    }
  };

  if (redirectOnLogin) {
    return <Redirect to={state?.from || '/'} />;
  }

  if (loginLoading) {
    return (
      <Box align='center'>
        <Loading text='Authenticating to Peloton' />
      </Box>
    );
  }

  return (
    <Box align='center' pad='large'>
      {authState.isAuthenticated && <Redirect to='/' />}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Heading level='1' size='24px' textAlign='center'>
        Authenticate to your Peloton account to get started
      </Heading>
      <Box width='medium' margin='small' pad='medium' background='#F7F7F7'>
        <Form onSubmit={handleSubmit}>
          <FormField name='username' htmlFor='text-input-username' label='Username'>
            <TextInput
              id='text-input-username'
              name='username'
              placeholder='Your Peloton Username'
              onChange={handleUsernameChange}
              value={username}
            />
          </FormField>
          <FormField name='password' htmlFor='text-input-password' label='Password'>
            <TextInput
              id='text-input-password'
              name='password'
              type='password'
              onChange={handlePasswordChange}
              value={password}
            />
          </FormField>
          <Box>
            <Button
              type='submit'
              primary
              label='Submit'
              alignSelf='center'
              disabled={!username || !password}
            />
          </Box>
        </Form>
      </Box>
    </Box>
  );
}
