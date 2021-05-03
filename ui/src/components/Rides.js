import React, { useContext, useEffect, useReducer, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Grid, Heading, Nav, Text } from 'grommet'

import { ErrorMessage } from './ErrorMessage'
import Loading from './Loading'
import RideCard from './RideCard'
import { ApiContext } from '../contexts/api'
import { rideLengthConversions } from '../utils/helpers'


function RideLengthNav({selected, onUpdateRideLength}) {
  const rideLengths = ['All', '15 min', '20 min', '30 min', '45 min', '60 min'];

  return (
    <Box align='center' pad='medium'>
      <Nav direction='row' align='center'>
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
    <Box pad={{ horizontal: 'large', vertical: 'medium'}}>
      <Grid
        gap={{ row: 'xlarge', column: 'large'}}
        rows='small'
        columns={{ count: 'fit', size: 'medium' }}
        justify='center'
      >
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

const ridesReducer = (state, action) => {
  if (action.type === 'success') {
    return {
      ...state,
      [action.selectedRideLength]: action.rides,
      error: null
    }
  } else if (action.type === 'error') {
    return {
      ...state,
      error: action.error
    }
  } else {
    throw new Error(`This action type isn't supported.`)
  }
}

export default function Rides() {
  const { getRides } = useContext(ApiContext);
  const [selectedRideLength, setSelectedRideLength] = useState('All');
  const [state, dispatch] = useReducer(ridesReducer, { error: null });
  const fetchedRideLengths = useRef([]);

  useEffect(() => {
    const fetchAndUpdateRides = async () => {
      if (fetchedRideLengths.current.includes(selectedRideLength) === false) {
        fetchedRideLengths.current.push(selectedRideLength);

        try {
          const { rides } = await getRides(rideLengthConversions[selectedRideLength]);
          dispatch({
            type: 'success',
            selectedRideLength,
            rides
          })
        } catch (error) {
          console.warn('Error fetching rides: ', error);
          dispatch({
            type: 'error',
            error: 'There was an error fetching the rides.'
          })
        }
      }
    }

    fetchAndUpdateRides();
  }, [selectedRideLength, getRides])

  const isLoading = () => !state[selectedRideLength] && state.error === null;

  return (
    <>
      <RideLengthNav
        selected={ selectedRideLength }
        onUpdateRideLength={ setSelectedRideLength }
      />
      <Box align='center'>
        { isLoading() && <Loading text={`Loading ${selectedRideLength} Rides`} />}
        { state.error && <ErrorMessage>{ state.error }</ErrorMessage>}
      </Box>
      { state[selectedRideLength] && state[selectedRideLength].length > 0 &&
        <>
          <Box align='center'>
            <Heading level='1' size='22px'>
              Select a ride you've taken to battle a friend.
            </Heading>
          </Box>
          <RidesGrid rides={state[selectedRideLength]} />
        </>
      }
      { !isLoading() && state[selectedRideLength] && state[selectedRideLength].length === 0 &&
        <Box align='center'>
          <Heading level='1' size='22px'>
            No rides to display.
          </Heading>
          <Text>Maybe you should try a {selectedRideLength} ride. 😉</Text>
        </Box>
      }
    </>
  )
}
