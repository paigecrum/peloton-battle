import React, { useContext, useEffect, useReducer } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Box, Heading, Text } from 'grommet'
import { CircleInformation } from 'grommet-icons'
import { AttentionSeeker } from 'react-awesome-reveal';
import queryString from 'query-string'

import { ApiContext } from '../contexts/api'
import { AuthContext } from '../contexts/auth'
import { ErrorMessage } from './ErrorMessage'
import Loading from './Loading'
import RideCard from './RideCard'
import ResultCard from './ResultCard'
import useRide from '../hooks/useRide'


export default function Results() {
  const { rideId } = useParams();
  const rideState = useRide(rideId);
  const location = useLocation();
  const { authState } = useContext(AuthContext);
  const { battle, getRideOpponents, getUserWorkout } = useContext(ApiContext);
  const appUserId = authState.userInfo.pelotonUserId;
  const [playersState, dispatchPlayers] = useReducer(
    playersReducer,
    { winner: null, loser: null, playersError: null, loadingPlayers: true }
  );

  const getUserInfo = async (userId, rideId) => {
    const data = await getUserWorkout(userId, rideId);
    return {
      userId,
      workoutId: data
    }
  };

  const getOpponentInfo = async(opponentUsername, rideId) => {
      // Get map of opponents for rideId, then get specific opponent object from that
      const opponents = await getRideOpponents(rideId);
      return opponents[opponentUsername];
  };

  useEffect(() => {
    const fetchAndUpdateResults = async () => {
      // Conditionally fetch ride & opponent if not navigating via ride details page
      try {
        if (!location.state) {
          const { opponent: opponentUsername } = queryString.parse(location.search);

          const [userObj, opponentObj] = await Promise.all([
            getUserInfo(appUserId, rideId),
            getOpponentInfo(opponentUsername, rideId)
          ]);

          const players = await battle([userObj, opponentObj]);
          dispatchPlayers({ type: 'success', winner: players[0], loser: players[1] });
        } else {
          const appUser = await getUserInfo(appUserId, rideId);
          const players = await battle([appUser, location.state.opponent]);
          dispatchPlayers({ type: 'success', winner: players[0], loser: players[1] });
        }
      } catch (error) {
        console.warn(error);
        dispatchPlayers({ type: 'error', error: 'There was an error battling your opponent.' });
      }
    }
    fetchAndUpdateResults();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  if (rideState.rideError) {
    return (
      <Box align='center'>
        <ErrorMessage>{ rideState.rideError }</ErrorMessage>
      </Box>
    )
  }

  if (playersState.playersError) {
    return (
      <Box align='center'>
        <ErrorMessage>{ playersState.playersError }</ErrorMessage>
      </Box>
    )
  }
  return (
    <Box margin={{ horizontal: 'large' }}>
      <Box align='center'>
        <Heading textAlign='center' level='1' size='small' margin={{ bottom: 'medium' }}>
          Battle Results
        </Heading>
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
        : <Box>
            {(playersState.winner.deviceType === 'web' || playersState.loser.deviceType === 'web') &&
              <AttentionSeeker effect='headShake'>
                <OffBrandBikeWarning />
              </AttentionSeeker>
            }
            <Box pad={{ top: '48px' }} justify='center' direction='row' wrap={true}>
              <ResultCard
                player={playersState.winner}
                outcome={playersState.winner.totalOutput === playersState.loser.totalOutput ? 'TIE' : 'WINNER'}
              />
              <ResultCard
                player={playersState.loser}
                outcome={playersState.winner.totalOutput === playersState.loser.totalOutput ? 'TIE' : 'LOSER'}
              />
            </Box>
          </Box>
      }
    </Box>
  )
}

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

function OffBrandBikeWarning() {
  return (
    <Box
      direction='row'
      gap='small'
      justify='center'
      align='center'
      round='medium'
      elevation='medium'
      width='500px'
      margin={{ horizontal: 'auto', top: 'medium' }}
      pad={{ vertical: 'xsmall', horizontal: 'small'}}
      background='#fcf388'
    >
      <Box margin={{ left: 'small' }}>
        <CircleInformation color='plain'/>
      </Box>
      <Text textAlign='center'>
        Both opponents must use a Peloton bike to battle.
      </Text>
    </Box>
  )
}
