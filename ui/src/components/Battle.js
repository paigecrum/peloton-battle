import React, { useEffect, useReducer } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Box, Grid, Heading } from 'grommet'

import Loading from './Loading'
import RideCard from './RideCard'
import OpponentCard from './OpponentCard'
import { getRideMetadata, getRideOpponents } from '../utils/api'

const rideReducer = (state, action) => {
  if (action.type === 'success') {
    return {
      ride: action.ride,
      rideError: null,
      loadingRide: false
    }
  } else if (action.type === 'error') {
    return {
      ...state,
      rideError: action.error,
      loadingRide: false
    }
  } else {
    throw new Error(`This action type isn't supported.`)
  }
}

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
  const location = useLocation();
  const [rideState, dispatchRide] = useReducer(
    rideReducer,
    { ride: null, rideError: null, loadingRide: true }
  );
  const [opponentsState, dispatchOpponents] = useReducer(
    opponentsReducer,
    { opponents: [], opponentsError: null, loadingOpponents: true }
  );

  const updateRide = (rideId) => {
    getRideMetadata(rideId)
      .then((ride) => {
        dispatchRide({ type: 'success', ride });
      })
      .catch((error) => {
        console.warn('Error fetching ride: ', error);
        dispatchRide({ type: 'error', error: 'There was an error fetching ride from the ride ID param.' });
      })
  }

  useEffect(() => {
   // Conditionally fetch ride if not navigating via ride details page
    if (!location.state) {
      updateRide(rideId);
    } else {
      dispatchRide({ type: 'success', ride: location.state.ride });
    }

    getRideOpponents(rideId)
      .then((opponents) => {
        dispatchOpponents({ type: 'success', opponents });
      })
      .catch((error) => {
        console.warn('Error fetching ride info: ', error)
        dispatchOpponents({ type: 'error', error: 'There was an error fetching your ride info.' });
      })
  }, [rideId, location.state])

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
