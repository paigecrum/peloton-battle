import React, { useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Grid, Heading } from 'grommet'

import Loading from './Loading'
import RideCard from './RideCard'
import OpponentCard from './OpponentCard'
import useRide from '../hooks/useRide'
import { getRideOpponents } from '../utils/api'

const opponentsReducer = (state, action) => {
  if (action.type === 'success') {
    return {
      opponents: action.opponents,
      opponentsError: null,
      loadingOpponents: false
    }
  } else if (action.type === 'error') {
    return {
      ...state,
      opponentsError: action.error,
      loadingOpponents: false
    }
  } else {
    throw new Error(`This action type isn't supported.`)
  }
}

export default function Battle() {
  const { rideId } = useParams();
  const rideState = useRide(rideId);
  const [opponentsState, dispatchOpponents] = useReducer(
    opponentsReducer,
    { opponents: [], opponentsError: null, loadingOpponents: true }
  );

  useEffect(() => {
    getRideOpponents(rideId)
      .then((opponents) => {
        dispatchOpponents({ type: 'success', opponents });
      })
      .catch((error) => {
        console.warn('Error fetching ride info: ', error)
        dispatchOpponents({ type: 'error', error: 'There was an error fetching your ride info.' });
      })
  }, [rideId])

  if (rideState.error) {
    return (
      <p className='center-text error'>{rideState.error}</p>
    )
  }

  if (opponentsState.error) {
    return (
      <p className='center-text error'>{opponentsState.error}</p>
    )
  }

  return (
    <Box margin='large'>
      { rideState.loadingRide === true
        ? <Box align='center'>
            <Loading text='Loading Ride' />
          </Box>
        : <Box align='center'>
            <RideCard ride={rideState.ride} />
          </Box>
      }
      { opponentsState.loadingOpponents === true
        ? rideState.loadingRide === false &&
          <Box align='center'>
            <Loading text='Loading Opponents' />
          </Box>
        : <React.Fragment>
            <Box align='center'>
              <Heading textAlign='center' margin={{ bottom: 'medium' }} level='3' size='small' color='dark-2'>
                Pick one of your {Object.keys(opponentsState.opponents).length} friends who has taken this ride to battle.
              </Heading>
            </Box>
            <Grid gap='medium' rows='small' justify='center' columns={{ count: 'fit', size: 'small' }}>
              { Object.keys(opponentsState.opponents).map((opponentUsername) => {
                return (
                  <OpponentCard key={opponentsState.opponents[opponentUsername].userId} opponent={opponentsState.opponents[opponentUsername]} ride={rideState.ride} />
                )
              })}
            </Grid>
          </React.Fragment>
      }
    </Box>
  )
}
