import React, { useContext, useEffect, useReducer } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Box, Grid, Heading } from 'grommet'
import queryString from 'query-string'

import { AuthContext } from '../contexts/auth'
import { ErrorMessage } from './ErrorMessage'
import Loading from './Loading'
import RideCard from './RideCard'
import ResultCard from './ResultCard'
import useRide from '../hooks/useRide'
import { battle, getRideOpponents, getUserWorkout } from '../utils/api'


const playersReducer = (state, action) => {
  if (action.type === 'success') {
    return {
      winner: action.winner,
      loser: action.loser,
      playersError: null,
      loadingPlayers: false
    }
  } else if (action.type === 'error') {
    return {
      ...state,
      playersError: action.error,
      loadingPlayers: false
    }
  } else {
    throw new Error(`This action type isn't supported.`)
  }
}

export default function Results() {
  const { rideId } = useParams();
  const rideState = useRide(rideId);
  const location = useLocation();
  const { authState } = useContext(AuthContext);
  const appUserId = authState.pelotonUserId;
  const [playersState, dispatchPlayers] = useReducer(
    playersReducer,
    { winner: null, loser: null, playersError: null, loadingPlayers: true }
  );

  const updatePlayers = (appUser, opponent) => {
    battle([appUser, opponent])
      .then((players) => {
        dispatchPlayers({ type: 'success', winner: players[0], loser: players[1] });
      })
      .catch((error) => {
        console.warn(error);
        dispatchPlayers({ type: 'error', error: 'There was an error battling your opponent.' });
      })
  }

  const getUserInfo = (userId, rideId) => {
    return getUserWorkout(userId, rideId)
      .then((data) => {
        return {
          userId,
          workoutId: data
        }
      })
      .catch((error) => {
        console.warn('Error fetching user: ', error)
      })
  }

  const getOpponentInfo = (opponentUsername, rideId) => {
    // Get map of opponents for rideId, then get specific opponent object from that
    return getRideOpponents(rideId)
      .then((opponents) => {
        return opponents[opponentUsername]
      })
      .catch((error) => {
        console.warn('Error fetching opponents: ', error)
      })
  }

  useEffect(() => {
    // Conditionally fetch ride & opponent if not navigating via ride details page
    if (!location.state) {
      const { opponent: opponentUsername } = queryString.parse(location.search);

      Promise.all([
        getUserInfo(appUserId, rideId),
        getOpponentInfo(opponentUsername, rideId)
      ]).then(([userObj, opponentObj]) => {
        updatePlayers(userObj, opponentObj);
      })
    } else {
      getUserInfo(appUserId, rideId)
        .then((appUser) => {
          updatePlayers(appUser, location.state.opponent);
        })
    }
  }, [appUserId, rideId, location.state, location.search])

  return (
    <Box margin={{ bottom: 'large' }}>
      <Box align='center'>
        <Heading textAlign='center' level='1' size='small' margin={{ bottom: 'medium' }} color='dark-2'>
          Battle Results
        </Heading>
        { rideState.rideError && <ErrorMessage>{ rideState.rideError }</ErrorMessage>}
        { playersState.playersError && <ErrorMessage>{ playersState.playersError }</ErrorMessage>}
      </Box>
      { rideState.loadingRide === true
        ? <Box align='center'>
            <Loading text='Loading Ride' />
          </Box>
        : <Box align='center'>
            <RideCard ride={rideState.ride} />
          </Box>
      }
      { playersState.loadingPlayers === true
        ? rideState.loadingRide === false &&
          <Box align='center'>
            <Loading text='Battling' />
          </Box>
        : <Box pad={{ top: 'large'}}>
            <Grid
              gap='medium'
              rows='medium'
              justify='center'
              columns={{ count: 'fit', size: 'medium' }}
              margin={{ left: 'xlarge', right: 'xlarge' }}
            >
              <ResultCard
                player={playersState.winner}
                outcome={playersState.winner.totalOutput === playersState.loser.totalOutput ? 'Tie' : 'Winner'}
              />
              <ResultCard
                player={playersState.loser}
                outcome={playersState.winner.totalOutput === playersState.loser.totalOutput ? 'Tie' : 'Loser'}
              />
            </Grid>
          </Box>
      }
    </Box>
  )
}
