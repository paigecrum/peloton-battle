import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Box, Card, CardBody, CardFooter, Stack, Text } from 'grommet'
import { Calendar, User } from 'grommet-icons'
import 'styled-components/macro'

import useHoverAnimation from '../hooks/useHoverAnimation'
import { instructorMap, formatDate } from '../utils/helpers'

export default function RideCard({ ride }) {
  const [shouldAnimate, attrs] = useHoverAnimation();
  const history = useHistory();

  const handleClickCard = () => {
    history.push(`/battle/${ride.id}`, { ride });
  }

  return (
    <ImageCard
      height='234px'
      width='418px'
      src={ride.imageUrl}
      animation={shouldAnimate ? {type: 'zoomIn', size: 'small', duration: 500} : undefined}
      onClick={handleClickCard}
      {...attrs}
    >
      <CardBody />
      <CardFooter
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
        { ride.numFriends > 0 &&
          <Box alignSelf='end'>
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
          </Box>
        }
      </CardFooter>
    </ImageCard>
  )
}

const ImageCard = styled(Card)`
  background-color: black;
  background-image: url("${(props) => props.src}");
  background-size: cover;
`;
