import React from 'react'
import { Box, Grid, Heading } from 'grommet'
import queryString from 'query-string'

import Loading from './Loading'
import RideCard from './RideCard'
import ResultCard from './ResultCard'
import { battle, getRideMetadata, getRideOpponents, getUserWorkout } from '../utils/api'

export default class Results extends React.Component {
  state = {
    ride: null,
    winner: null,
    loser: null,
    loadingRide: true,
    loadingPlayers: true,
    error: null
  }

  updateRide(rideId) {
    getRideMetadata(rideId)
      .then((ride) => {
        this.setState({ ride, loadingRide: false })
      })
      .catch((error) => {
        console.warn('Error fetching ride: ', error);

        this.setState({
          error: 'There was an error fetching ride from the ride ID param.',
          loadingRide: false
        })
      })
  }

  updatePlayers(appUser, opponent) {
    battle([appUser, opponent])
      .then((players) => {
        this.setState({
          winner: players[0],
          loser: players[1],
          error: null,
          loadingPlayers: false
        })
      })
      .catch((error) => {
        console.warn(error);

        this.setState({
          error: 'There was an error battling your opponent.',
          loadingPlayers: false
        })
      })
  }

  getUserInfo(userId, rideId) {
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

  getOpponentInfo(opponentUsername, rideId) {
    // Get map of opponents for rideId, then get specific opponent object from that
    return getRideOpponents(rideId)
      .then((opponents) => {
        return opponents[opponentUsername]
      })
      .catch((error) => {
        console.warn('Error fetching opponents: ', error)
      })
  }

  componentDidMount() {
    const { rideId } = this.props.match.params;
    // TODO: Replace hardcoded userId with logged in user ID, hardcoding for now
    const appUserId = '7e3d7de8febc41c2b8f288e26ad8de14';

    // Conditionally fetch ride & opponent if not navigating via ride details page
    if (!this.props.location.state) {
      const { opponent: opponentUsername } = queryString.parse(this.props.location.search);

      this.updateRide(rideId);

      Promise.all([
        this.getUserInfo(appUserId, rideId),
        this.getOpponentInfo(opponentUsername, rideId)
      ]).then(([userObj, opponentObj]) => {
        this.updatePlayers(userObj, opponentObj)
      })
    } else {
      this.setState({
        ride: this.props.location.state.ride,
        loadingRide: false
      })

      this.getUserInfo(appUserId, rideId)
        .then((appUser) => {
          this.updatePlayers(appUser, this.props.location.state.opponent);
        })
    }
  }

  render() {
    const { ride, winner, loser, loadingRide, loadingPlayers, error } = this.state;

    if (error) {
      return (
        <p className='center-text error'>{error}</p>
      )
    }

    return (
      <Box margin={{ bottom: 'large' }}>
        <Box align='center'>
          <Heading textAlign='center' level='1' size='small' margin={{ bottom: 'medium' }} color='dark-2'>
            Battle Results
          </Heading>
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
}
