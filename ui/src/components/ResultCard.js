import React from 'react'
import { Avatar, Box, Card, CardHeader, CardBody, CardFooter, Heading, Text } from 'grommet'

import { formatDate } from '../utils/helpers'


export default function ResultCard({ player, outcome }) {
  return (
    <Card height='medium' width='medium' margin='small' background='light-1'>
      <CardHeader justify='center'>
        <Heading level='2' size='small' margin={{ top: 'medium', bottom: 'xsmall' }}>{outcome}</Heading>
      </CardHeader>
      <CardBody align='center' justify='center'>
        <Avatar src={player.avatarUrl} size='3xl' />
        <Box align='center' margin='xsmall'>
          <Heading margin='none' level='3' size='small'>
            {player.username}
          </Heading>
          <Box pad={{ top: 'xsmall' }} align='center'>
            { player.stats.summaries.map((stat) => (
              <Text
                key={stat.slug}
                size={stat.slug === 'total_output' ? '16px' : 'small'}
                margin={stat.slug === 'total_output' ? { vertical: 'xsmall' } : '0px'}
              >
                <b>{stat.display_name}:</b> {stat.value} {stat.display_unit}
              </Text>
            ))}
          </Box>
        </Box>
      </CardBody>
      <CardFooter justify='center' pad={{ bottom: 'medium' }}>
        <Text size='small'>
          {formatDate(player.startedClassAt)}
        </Text>
      </CardFooter>
    </Card>
  )
}
