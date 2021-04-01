import React from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Grid, Nav, Heading } from 'grommet'
import styled from 'styled-components'

import Loading from './Loading'
import RideCard from './RideCard'
import { getRides } from '../utils/api'
import { rideLengthConversions } from '../utils/helpers'


function RideLengthNav({selected, onUpdateRideLength}) {
  const rideLengths = ['All', '15 min', '20 min', '30 min', '45 min', '60 min'];

  return (
    <Box align='center' pad='medium'>
      <Nav direction='row' align='center' pad='medium'>
        { rideLengths.map((rideLength) => (
          <Button
            key={rideLength}
            label={rideLength}
            onClick={() => onUpdateRideLength(rideLength)}
          />
        ))}
      </Nav>
    </Box>
  )
}

RideLengthNav.propTypes = {
  selected: PropTypes.string.isRequired,
  onUpdateRideLength: PropTypes.func.isRequired
}

function RidesGrid({ rides }) {
  return (
    <Box pad='medium'>
      <Grid gap='medium' rows='medium' justify='center' columns={{ count: 'fit', size: 'medium' }}>
        { rides.map((ride) => (
          <RideCard key={ride.id} ride={ride} />
        ))}
      </Grid>
    </Box>
  )
}

RidesGrid.propTypes = {
  rides: PropTypes.array.isRequired
}

export default class Rides extends React.Component {
  state = {
    selectedRideLength: 'All',
    rides: {},
    error: null
  }

  componentDidMount() {
    this.updateRideLength(this.state.selectedRideLength)
  }

  isLoading = () => {
    const { selectedRideLength, rides, error } = this.state
    return !rides[selectedRideLength] && error === null
  }

  updateRideLength = (selectedRideLength) => {
    this.setState({
      selectedRideLength,
      error: null
    })

    if (!this.state.rides[selectedRideLength]) {
      getRides(rideLengthConversions[selectedRideLength])
        .then((data) => {
          this.setState(({ rides }) => {
            return {
              rides: {
                ...rides,
                [selectedRideLength]: data
              }
            }
          })
        })
        .catch((error) => {
          console.warn('Error fetching rides: ', error)

          this.setState({
            error: 'There was an error fetching your rides.'
          })
        })

    }
  }

  render() {
    const { selectedRideLength, rides, error } = this.state;

    return (
      <React.Fragment>
        <RideLengthNav
          selected={ selectedRideLength }
          onUpdateRideLength={ this.updateRideLength }
        />
        <Box align='center'>
          <Heading margin={{ bottom: 'medium' }} level='3' size='small' color='dark-2'>
            Select a ride you've taken to battle a friend.
          </Heading>
          { this.isLoading() && <Loading text={`Loading ${selectedRideLength} Rides`} />}
          { error && <ErrorMessage>{ error }</ErrorMessage>}
        </Box>
        { rides[selectedRideLength] && <RidesGrid rides={rides[selectedRideLength]} /> }
      </React.Fragment>
    )
  }
}

const ErrorMessage = styled(Text)`
  color: #ff1616;
  margin: 30px 0;
`;
