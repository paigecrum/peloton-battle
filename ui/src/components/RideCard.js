import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Box, Card, CardHeader, CardBody, CardFooter, Heading, Image, Stack, Text } from 'grommet'
import { Calendar, User } from 'grommet-icons'

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
        <CardFooter pad={{horizontal: 'small'}} background='light-2'>
          <Box direction='row'>
            <Box margin={{ vertical: 'medium' }}><Calendar /></Box>
            <Text
              textAlign='center'
              margin={{ vertical: 'small', horizontal: 'small' }}
            >
              {formatDate(ride.classStartTimestamp)}
            </Text>
          </Box>
          <Text textAlign='center'>
            {instructorMap[ride.instructorId]}
          </Text>
          <Stack anchor='top-right'>
            <User size='large' />
            <Box
              background='brand'
              pad={{ horizontal: 'xsmall' }}
              round
            >
              <Text>{ride.numFriends}</Text>
            </Box>
          </Stack>
        </CardFooter>
      </Card>
    </StyledLink>
  )
}
