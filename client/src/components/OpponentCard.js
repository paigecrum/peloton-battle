import React from 'react'
import { useHistory } from 'react-router-dom'
import { Avatar, Card, CardBody, Heading, Text } from 'grommet'

import useHoverAnimation from '../hooks/useHoverAnimation'
import { formatDate } from '../utils/helpers'

export default function OpponentCard({ opponent, ride }) {
  const history = useHistory();
  const [shouldAnimate, attrs] = useHoverAnimation();

  const handleClickCard = () => {
    history.push({
      pathname: `/battle/${opponent.rideId}/results`,
      search: `?opponent=${opponent.username}`,
      state: { opponent, ride }
    })
  }

  return (
    <Card
      height='small'
      width='small'
      pad='small'
      margin={{ horizontal:'medium' }}
      onClick={handleClickCard}
      alignContent='center'
      animation={shouldAnimate ? {type: 'zoomIn', size: 'small', duration: 500} : undefined}
      {...attrs}
    >
      <CardBody align='center' justify='center'>
        <Avatar
          src={opponent.avatarUrl}
          size='xlarge'
          margin={{ top: 'small', bottom: 'xsmall' }}
        />
        <Heading margin='none' level='4' size='medium'>
          {opponent.username}
        </Heading>
        <Text size='xsmall' color='black'>
          {formatDate(opponent.startedClassAt)}
        </Text>
      </CardBody>
    </Card>
  )
}
