import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Box, Card, CardBody, CardHeader, Image, Stack, Text } from 'grommet'
import { Calendar, User } from 'grommet-icons'
import "styled-components/macro"

import { instructorMap, formatDate } from '../utils/helpers'

const StyledLink = styled(Link)`
  text-decoration: none;
`;

export default function RideCard({ ride }) {
  const [hovering, setHovering] = useState(false);

  return (
    <StyledLink
      to={{
        pathname: `/battle/${ride.id}`,
        state: { ride }
      }}
    >
      <Card
        height='234px'
        width='418px'
        animation={hovering ? {type: 'zoomIn'/*, delay: 1000*/} : null}
        onMouseOver={() => setHovering(true)}
        onMouseOut={() => setHovering(false)}
      >
        <Stack anchor='bottom-left'>
          <CardBody height='234px'>
            <Image
              fit='cover'
              src={ride.imageUrl}
              a11yTitle='Thumbnail from selected ride.'
            />
          </CardBody>
          <CardHeader
            pad={{ horizontal: 'small', vertical: 'xsmall' }}
            background='#000000A0'
            width='418px'
            justify='between'
          >
            <Box>
              <Text size='16px' weight={600}  margin='none'>
                {ride.title}
              </Text>
              <Text size='small'>{instructorMap[ride.instructorId]}</Text>
              <Box direction='row' align='center'>
                <Calendar size='small' />
                <Text size='xsmall' margin={{ horizontal: 'xsmall'}}>
                  {formatDate(ride.classStartTimestamp)}
                </Text>
              </Box>
            </Box>
            <Stack anchor='top-right'>
              <User size='30px' />
              <Box
                background='brand'
                responsive={false}
                align='center'
                height='15px'
                width='15px'
                round
              >
                <Text color='white' size='11px' css='position: relative; top: 1px'>
                  {ride.numFriends}
                </Text>
              </Box>
            </Stack>
          </CardHeader>
        </Stack>
      </Card>
    </StyledLink>
  )
}
