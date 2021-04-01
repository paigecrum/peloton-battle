import React from 'react'
import { Redirect } from 'react-router-dom'
import { Box, Button, Form, FormField, Heading, TextInput } from 'grommet'

import { authorize } from '../utils/api'

export default class LoginForm extends React.Component {
  state = {
    username: '',
    password: '',
    error: null,
    redirectOnLogin: false
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    authorize(e.value)
      .then((data) => {
        this.setState({
          username: data.user.username,
          userId: data.user.id,
          redirectOnLogin: true
        })
      })
      .catch((error) => {
        console.warn('Error authorizing user: ', error);
        this.setState({
          error: 'Peloton authentication failed with provided credentials.'
        })
      })
  }

  render() {
    const { username, password, error, redirectOnLogin } = this.state;


    if (error) {
      return (
        <p className='center-text error'>{error}</p>
      )
    }

    if (redirectOnLogin) {
      return <Redirect to='/' />
    }

    return (
      <Box align='center' pad='large'>
        <Heading level={2} size="xsmall">
          Authenticate to your Peloton account to get started
        </Heading>
        <Box width='medium' pad='medium' background="#F7F7F7">
          <Form onSubmit={this.handleSubmit} >
            <FormField name="username" htmlFor="text-input-username" label="Username">
              <TextInput
                id="text-input-username"
                name="username"
                placeholder='Your Peloton Username'
                onChange={this.handleChange}
                value={username}
              />
            </FormField>
            <FormField name="password" htmlFor="text-input-password" label="Password">
              <TextInput
                id="text-input-password"
                name="password"
                type='password'
                onChange={this.handleChange}
                value={password}
              />
            </FormField>
            <Button type="submit" primary label="Submit" disabled={!username || !password} />
          </Form>
        </Box>
      </Box>
    )
  }
}
