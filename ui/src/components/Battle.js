import React, { useContext, useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Grid, Heading } from 'grommet'

import { ErrorMessage } from './ErrorMessage'
import Loading from './Loading'
import RideCard from './RideCard'
import OpponentCard from './OpponentCard'
import useRide from '../hooks/useRide'
import { ApiContext } from '../contexts/api'

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
    throw new Error(`This action type isn't supported.`);
  }
};

export default function Battle() {
  const { getRideOpponents } = useContext(ApiContext);
  const { rideId } = useParams();
  const rideState = useRide(rideId);
  const [opponentsState, dispatchOpponents] = useReducer(opponentsReducer, {
    opponents: [],
    opponentsError: null,
    loadingOpponents: true
  });

  useEffect(() => {
    const fetchAndUpdateOpponents = async () => {
      try {
        const opponents = await getRideOpponents(rideId);
        dispatchOpponents({ type: 'success', opponents });
      } catch (error) {
        console.warn('Error fetching ride info: ', error);
        dispatchOpponents({ type: 'error', error: 'There was an error fetching your ride info.' });
      }
    };
    fetchAndUpdateOpponents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (rideState.error) {
    return (
      <Box align='center'>
        <ErrorMessage>{rideState.error}</ErrorMessage>
      </Box>
    );
  }

  if (opponentsState.error) {
    return (
      <Box align='center'>
        <ErrorMessage>{opponentsState.error}</ErrorMessage>
      </Box>
    );
  }

  return (
    <Box margin='large'>
      {rideState.loadingRide === true ? (
        <Box align='center' margin={{ bottom: 'small' }}>
          <Loading text='Loading Ride' />
        </Box>
      ) : (
        <Box align='center' margin={{ bottom: 'small' }}>
          <RideCard ride={rideState.ride} />
        </Box>
      )}
      {opponentsState.loadingOpponents === true ? (
        rideState.loadingRide === false && (
          <Box align='center' margin={{ bottom: 'small' }}>
            <Loading text='Loading Opponents' />
          </Box>
        )
      ) : (
        <React.Fragment>
          <Box align='center'>
            <Heading textAlign='center' margin='medium' level='1' size='22px'>
              Pick one of your {Object.keys(opponentsState.opponents).length} friends who has taken this ride
              to battle.
            </Heading>
          </Box>
          <Grid gap='medium' margin='small' rows='small' justify='center' columns={{ count: 'fit', size: 'small' }}>
            {Object.keys(opponentsState.opponents).map((opponentUsername) => {
              return (
                <OpponentCard
                  key={opponentsState.opponents[opponentUsername].userId}
                  opponent={opponentsState.opponents[opponentUsername]}
                  ride={rideState.ride}
                />
              );
            })}
          </Grid>
        </React.Fragment>
      )}
    </Box>
  );
}
