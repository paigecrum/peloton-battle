import React, { useRef, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Box, Button, Form, FormField, Heading, TextInput } from 'grommet'

import { authorize } from '../utils/api'
import { ErrorMessage } from './ErrorMessage'
import Loading from './Loading'


export default function LoginForm() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [redirectOnLogin, setRedirectOnLogin] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    setLoginLoading(true);

    authorize({username, password})
      .then((data) => {
        setRedirectOnLogin(true);
      })
      .catch((error) => {
        setLoginLoading(false);
        console.warn('Error authorizing user: ', error);
        setError('Peloton authentication failed with provided credentials. Please try again.');
      })
  }

  if (redirectOnLogin) {
    return <Redirect to='/' />
  }

  if (loginLoading) {
    return (
      <Box align='center'>
        <Loading text='Authenticating to Peloton' />
      </Box>
    )
  }

  return (
    <Box align='center' pad='large'>
      { error && <ErrorMessage>{ error }</ErrorMessage>}
      <Heading level={2} size="xsmall">
        Authenticate to your Peloton account to get started
      </Heading>
      <Box width='medium' pad='medium' background='#F7F7F7'>
        <Form>
          <FormField name='username' htmlFor='text-input-username' label='Username'>
            <TextInput
              id='text-input-username'
              name='username'
              placeholder='Your Peloton Username'
              ref={usernameRef}
            />
          </FormField>
          <FormField name='password' htmlFor='text-input-password' label='Password'>
            <TextInput
              id='text-input-password'
              name='password'
              type='password'
              ref={passwordRef}
            />
          </FormField>
          <Button
            type='submit'
            primary
            label='Submit'
            onClick={handleSubmit}
          />
        </Form>
      </Box>
    </Box>
  )
}
