import React from 'react'
import { Box, Grid, Heading } from 'grommet'

import Loading from './Loading'
import RideCard from './RideCard'
import OpponentCard from './OpponentCard'
import { getRideMetadata, getRideOpponents } from '../utils/api'

export default class Battle extends React.Component {
  state = {
    ride: null,
    opponents: [],
    error: null,
    loadingRide: true,
    loadingOpponents: true
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

  componentDidMount() {
    const { rideId } = this.props.match.params;

   // Conditionally fetch ride if not navigating via ride details page
    if (!this.props.location.state) {
      this.updateRide(rideId);
    } else {
      this.setState({
        ride: this.props.location.state.ride,
        loadingRide: false
      })
    }

    getRideOpponents(rideId)
      .then((opponents) => {
        this.setState({ opponents, loadingOpponents: false, error: null })
      })
      .catch((error) => {
        console.warn('Error fetching ride info: ', error)

        this.setState({
          error: 'There was an error fetching your ride info.'
        })
      })
  }

  render() {
    const { ride, opponents, loadingRide, loadingOpponents, error } = this.state;

    if (error) {
      return (
        <p className='center-text error'>{error}</p>
      )
    }

    return (
      <Box margin='large'>
        { loadingRide === true
          ? <Box align='center'>
              <Loading text='Loading Ride' />
            </Box>
          : <Box align='center'>
              <RideCard ride={ride} />
            </Box>
        }
        { loadingOpponents === true
          ? loadingRide === false &&
            <Box align='center'>
              <Loading text='Loading Opponents' />
            </Box>
          : <React.Fragment>
              <Box align='center'>
                <Heading textAlign='center' margin={{ bottom: 'medium' }} level='3' size='small' color='dark-2'>
                  Pick one of your {Object.keys(opponents).length} friends who has taken this ride to battle.
                </Heading>
              </Box>
              <Grid gap='medium' rows='small' justify='center' columns={{ count: 'fit', size: 'small' }}>
                { Object.keys(opponents).map((opponentUsername) => {
                  return (
                    <OpponentCard key={opponents[opponentUsername].userId} opponent={opponents[opponentUsername]} ride={ride} />
                  )
                })}
              </Grid>
            </React.Fragment>
        }
      </Box>
    )
  }
}