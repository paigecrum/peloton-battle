import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { Avatar, Box, Button, Header, Menu, Text } from 'grommet'
import { Home } from 'grommet-icons'

import { AuthContext } from '../contexts/auth'

export default function Nav() {
  const { authState, logout } = useContext(AuthContext);

  return (
    <Header background='light-2'>
      <NavLink to='/' exact className='nav-link'>
        <Button icon={<Home />} hoverIndicator />
      </NavLink>
      <Box direction='row'>
        <Text size='small' alignSelf='center'>{authState.pelotonUsername}</Text>
        <Menu
          label={<Avatar src={authState.pelotonAvatarUrl} size='small' />}
          items={[{
            label: 'logout',
            onClick: () => logout()
          }]} />
      </Box>
    </Header>
  )
}
