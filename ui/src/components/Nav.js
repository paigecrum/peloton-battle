import React from 'react'
import { NavLink } from 'react-router-dom'
import { Avatar, Box, Button, Header, Menu, Text } from 'grommet'
import { Home } from 'grommet-icons'

// TODO: Update username & avatar to logged-in user
const pelotonAvatarURL =
  'https://s3.amazonaws.com/peloton-profile-images/5ef10f407f9f5f4078e53b3be9e0d70773969f5c/91039b1a33124aa88d139e0e61faa26e';

export default function Nav() {
  return (
    <Header background='light-2'>
      <NavLink to='/' exact className='nav-link'>
        <Button icon={<Home />} hoverIndicator />
      </NavLink>
      <Box direction='row'>
        <Text size='small' alignSelf='center'>PaigeMicheloton</Text>
        <Menu label={<Avatar src={pelotonAvatarURL} size='small' />} items={[{ label: 'logout'}]} />
      </Box>
    </Header>
  )
}
