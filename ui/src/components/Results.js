import React, { useContext, useEffect, useState } from 'react'
import { Box, Grid, Heading } from 'grommet'
import queryString from 'query-string'

import { AuthContext } from '../contexts/auth'
import { ErrorMessage } from './ErrorMessage'
import Loading from './Loading'
import RideCard from './RideCard'
import ResultCard from './ResultCard'
import { battle, getRideMetadata, getRideOpponents, getUserWorkout } from '../utils/api'

export default function Results(props) {
  const { authState } = useContext(AuthContext);
  const [ride, setRide] = useState(null);
  const [winner, setWinner] = useState(null);
  const [loser, setLoser] = useState(null);
  const [loadingRide, setLoadingRide] = useState(true);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [error, setError] = useState(null);


  const updateRide = (rideId) => {
    getRideMetadata(rideId)
      .then((ride) => {
        setRide(ride);
        setLoadingRide(false);
      })
      .catch((error) => {
        console.warn('Error fetching ride: ', error);
        setError('There was an error fetching ride from the ride ID param.');
        setLoadingRide(false);
      })
  }

  const updatePlayers = (appUser, opponent) => {
    battle([appUser, opponent])
      .then((players) => {
        setWinner(players[0]);
        setLoser(players[1]);
        setError(null);
        setLoadingPlayers(false);
      })
      .catch((error) => {
        console.warn(error);
        setError('There was an error battling your opponent.');
        setLoadingPlayers(false);
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
    const { rideId } = props.match.params;
    const appUserId = authState.pelotonUserId;

    // Conditionally fetch ride & opponent if not navigating via ride details page
    if (!props.location.state) {
      const { opponent: opponentUsername } = queryString.parse(props.location.search);

      updateRide(rideId);

      Promise.all([
        getUserInfo(appUserId, rideId),
        getOpponentInfo(opponentUsername, rideId)
      ]).then(([userObj, opponentObj]) => {
        updatePlayers(userObj, opponentObj);
      })
    } else {
      setRide(props.location.state.ride);
      setLoadingRide(false);

      getUserInfo(appUserId, rideId)
        .then((appUser) => {
          updatePlayers(appUser, props.location.state.opponent);
        })
    }
  }, [authState, props])

  return (
    <Box margin={{ bottom: 'large' }}>
      <Box align='center'>
        <Heading textAlign='center' level='1' size='small' margin={{ bottom: 'medium' }} color='dark-2'>
          Battle Results
        </Heading>
        { error && <ErrorMessage>{ error }</ErrorMessage>}
      </Box>
      { loadingRide === true
        ? <Box align='center'>
            <Loading text='Loading Ride' />
          </Box>
        : <Box align='center'>
            <RideCard ride={ride} />
          </Box>
      }
      { loadingPlayers === true
        ? loadingRide === false &&
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
              <ResultCard player={winner} outcome='Winner' />
              <ResultCard player={loser} outcome='Loser' />
            </Grid>
          </Box>
      }
    </Box>
  )
}
