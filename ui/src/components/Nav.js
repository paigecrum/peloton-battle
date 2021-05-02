import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { Avatar, Box, Button, Header, Menu, Text } from 'grommet'
import { Home, Logout } from 'grommet-icons'

import { AuthContext } from '../contexts/auth'

export default function Nav() {
  const { authState, logout } = useContext(AuthContext);

  return (
    <Header>
      <NavLink to='/' exact className='nav-link'>
        <Button icon={<Home />} hoverIndicator />
      </NavLink>
      <Box direction='row'>
        { authState.userInfo && authState.userInfo.pelotonUsername &&
          <>
            <Text size='small' alignSelf='center' margin='xsmall'>
              {authState.userInfo.pelotonUsername}
            </Text>
            <Box width={{min:'102px'}}>
              <Menu
                label={<Avatar src={authState.userInfo.pelotonAvatarUrl} size='small' />}
                items={[{
                  label: 'Logout',
                  icon: (
                    <Box direction='row' align='center'>
                      <Logout size='20px' />
                    </Box>
                  ),
                  reverse: true,
                  gap: 'small',
                  onClick: () => logout()
                }]}
                justifyContent='around'
              />
            </Box>
          </>
        }
      </Box>
    </Header>
  )
}
