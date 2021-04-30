import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Box, Card, CardHeader, CardBody, CardFooter, Heading, Image, Stack, Text } from 'grommet'
import { Calendar, User } from 'grommet-icons'
import "styled-components/macro"

import { instructorMap, formatDate } from '../utils/helpers'

const StyledLink = styled(Link)`
  text-decoration: none;
`;

export default function RideCard({ ride }) {
  return (
    <StyledLink
      to={{
        pathname: `/battle/${ride.id}`,
        state: { ride }
      }}
    >
      <Card height='medium' width='medium' background='light-1'>
        <CardHeader justify='center' pad='small' background='light-2'>
          <Heading margin='none' level='4' size='medium'>
            {ride.title}
          </Heading>
        </CardHeader>
        <CardBody>
          <Image
            fit='cover'
            src={`${ride.imageUrl}`}
            alt='Thumbnail from selected ride.'
          />
        </CardBody>
        <CardFooter pad={{horizontal: 'small', vertical: 'small'}} background='light-2' justify='evenly'>
          <Calendar />
          <Box direction='column' align='center'>
            <Text>{formatDate(ride.classStartTimestamp)}</Text>
          </Box>
          <Text>{instructorMap[ride.instructorId]}</Text>
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
              <Text color='white' size='11px' css='position: relative; top: 1px'>{ride.numFriends}</Text>
            </Box>
          </Stack>
        </CardFooter>
      </Card>
    </StyledLink>
  )
}
