import React from 'react'
import PropTypes from 'prop-types'

import { getRides } from '../utils/api'

function RideLengthNav({selected, onUpdateRideLength}) {
  const rideLengths = ['All', '15 min', '20 min', '30 min', '45 min', '60 min'];

  return (
    <ul className='flex-center'>
      { rideLengths.map((rideLength) => (
        <li key={rideLength}>
          <button 
            className='btn-clear nav-link'
            style={ 
              rideLength === selected
              ? { color: 'hsl(218,99%,66%)'}
              : null
            }
            onClick={() => onUpdateRideLength(rideLength)}>
              {rideLength}
          </button>
        </li>
      ))}
    </ul>
  )
}

RideLengthNav.propTypes = {
  selected: PropTypes.string.isRequired,
  onUpdateRideLength: PropTypes.func.isRequired
}

function RidesGrid({ rides }) {
  return (
    <div>
      <ul className='grid space-around'>
      { rides.map((ride) => (
        <li key={ride.id}>
          <div className='card'>
            <img
              className='card-test'
              src={`${ride.imageUrl}`}
              alt='Thumbnail from selected ride.'
            />
            <h4>{ride.title}</h4>
            <p>{ride.instructor}</p>
            <p>{`${ride.numFriends} friends have taken this class.`}</p>
            <p>{`Taken on ${ride.date}`}</p>
          </div>
        </li>
      ))}
      </ul>
    </div>
  )
}

RidesGrid.propTypes = {
  rides: PropTypes.array.isRequired
}

export default class Rides extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedRideLength: 'All',
      rides: {}
    }

    this.updateRideLength = this.updateRideLength.bind(this)
  }

  componentDidMount() {
    this.updateRideLength(this.state.selectedRideLength)
  }

  updateRideLength(selectedRideLength) {
    this.setState({
      selectedRideLength
    })

    if (!this.state.rides[selectedRideLength]) {
      this.setState(({ rides }) => {
        return {
          rides: {
            ...rides,
            [selectedRideLength]: getRides(selectedRideLength)
          }
        }
      })
    }
  }

  render() {
    const { selectedRideLength, rides } = this.state;

    return (
      <React.Fragment>
        <RideLengthNav
          selected={ selectedRideLength }
          onUpdateRideLength={ this.updateRideLength }
        />
        <p className='flex-center'>Select a ride you've taken to battle a friend.</p>
        { rides[selectedRideLength] && <RidesGrid rides={rides[selectedRideLength]} /> }
      </React.Fragment>
    )
  }
}