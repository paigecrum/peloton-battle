import React from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Card, CardHeader, CardBody, CardFooter, Heading, Text } from 'grommet'
import styled from 'styled-components'

import { formatDate } from '../utils/helpers'

const StyledLink = styled(Link)`
  text-decoration: none;
`;

export default function OpponentCard({ opponent, ride }) {
  return (
    <StyledLink
      to={{
        pathname: `/battle/${opponent.rideId}/results`,
        search: `?opponent=${opponent.username}`,
        state: { opponent, ride }
      }}
    >    
      <Card height='small' width='small' background='light-1'>
        <CardHeader justify='center' pad='small' background='light-2'>
          <Heading margin='none' level='4' size='medium'>
            {opponent.username}
          </Heading>
        </CardHeader>
        <CardBody align='center' pad='xsmall'>
          <Avatar src={opponent.avatarUrl} size='xlarge' />
        </CardBody>
        <CardFooter pad='xsmall' background='light-2'>
          <Text size='small' textAlign='center'>
            {`Taken: ${formatDate(opponent.startedClassAt)}`}
          </Text>
        </CardFooter>
      </Card>
    </StyledLink>
  )
}