import React from 'react'
import { Box, Button, Form, FormField, Heading, Text, TextInput } from 'grommet'

export default class LoginForm extends React.Component {
  state = {
    username: '',
    password: '',
    error: null
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add Auth logic
  }

  render() {
    const { username, password, error } = this.state;

    if (error) {
      return (
        <p className='center-text error'>{error}</p>
      )
    }

    return (
      <Box align='center' pad='large'>
        <Heading level={2} size="xsmall">
          Authenticate to your Peloton account to get started
        </Heading>
        <Box width='medium' pad='medium' background="#F7F7F7">
          <Form onSubmit={this.handleSubmit} >
            <FormField name="username" htmlFor="text-input-username" label="Username*">
              <TextInput
                id="text-input-username"
                name="username"
                placeholder='Your Peloton Username'
                onChange={this.handleChange}
                value={username}
              />
            </FormField>
            <FormField name="password" htmlFor="text-input-password" label="Password*">
              <TextInput
                id="text-input-password"
                name="password"
                type='password'
                onChange={this.handleChange}
                value={password}
              />
            </FormField>
            <Button type="submit" primary label="Submit" disabled={!username || !password} />
            <Text size="small" margin={{ left: 'small' }}>
              * Required Field
            </Text>
          </Form>
        </Box>
      </Box>
    )
  }
}
