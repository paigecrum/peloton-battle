import React from 'react'
import { Avatar, Card, CardHeader, CardBody, CardFooter, Heading, Text } from 'grommet'

import { formatDate } from '../utils/helpers'


export default function ResultCard({ player, outcome }) {
  return (
    <Card height='medium' width='medium' background='light-1'>
      <CardHeader justify='center' pad='small' background='light-2'>
        <Heading margin='none' level='3' size='medium'>{outcome}</Heading>
      </CardHeader>
      <CardBody align='center' pad='xsmall'>
        <Avatar src={player.avatarUrl} size='5xl'/>
        { player.stats.summaries.map((stat) => (
          <Text key={stat.slug}><b>{stat.display_name}:</b> {stat.value} {stat.display_unit}</Text>
        ))}
        <Text>
          <b>Date Taken:</b> {formatDate(player.startedClassAt)}
        </Text>
      </CardBody>
      <CardFooter justify='center' pad='xsmall' background='light-2'>
        <Heading margin='none' level='3' size='small'>
          {player.username}
        </Heading>
      </CardFooter>
    </Card>
  )
}