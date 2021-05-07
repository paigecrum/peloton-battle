import React from 'react'
import { Avatar, Box, Card, CardHeader, CardBody, CardFooter, Heading, Text } from 'grommet'

import { formatDate } from '../utils/helpers'


export default function ResultCard({ player, outcome }) {
  return (
    <Card height='250px' width='250px' margin='large' align='center' background='light-1' overflow='visible'>
      <CardHeader  margin='-50px'>
        <Avatar src={player.avatarUrl} size='100px'/>
      </CardHeader>
      <CardBody align='center' justify='center' width='220px' pad={{ top: 'large' }}>
        <Heading level='3' size='22px' margin='none'>
          {player.username}
        </Heading>
        <Box pad={{ top: 'xsmall' }} align='center'>
          { player.stats.summaries.map((stat) => (
            <Text
              key={stat.slug}
              size={stat.slug === 'total_output' ? '17px' : 'small'}
              margin={stat.slug === 'total_output' ? { vertical: 'xsmall' } : '0px'}
            >
              <b>{stat.display_name}:</b> {stat.value} {stat.display_unit}
            </Text>
          ))}
          <Box pad={{ top: 'small' }}>
            <Text size='small'>
              {formatDate(player.startedClassAt)}
            </Text>
          </Box>
        </Box>
      </CardBody>
      <CardFooter width='250px' pad={{ vertical: 'xsmall' }} justify='center' background='light-3'>
        <Heading level='3' size='small' margin='none'>
          {outcome}
        </Heading>
      </CardFooter>
    </Card>
  )
}
