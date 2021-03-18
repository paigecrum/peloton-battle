import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { getRides } from '../utils/api'
import { instructorMap, formatDate, rideLengthConversions } from '../utils/helpers'


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
            <Link to={`/ride/${ride.id}`}>
              <img
                className='card-test'
                src={`${ride.imageUrl}`}
                alt='Thumbnail from selected ride.'
              />
            </Link>
            <h4>{ride.title}</h4>
            <h3>{ride.id}</h3>
            <h4>{ride.imageUrl}</h4>
            <p>{instructorMap[ride.instructorId]}</p>
            <p>{`${ride.numFriends} friends have taken this class.`}</p>
            <p>{`Aired on ${formatDate(ride.classStartTimestamp)}`}</p>
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
      rides: {},
      error: null
    }

    this.updateRideLength = this.updateRideLength.bind(this)
    this.isLoading = this.isLoading.bind(this)
  }

  componentDidMount() {
    this.updateRideLength(this.state.selectedRideLength)
  }

  isLoading() {
    const { selectedRideLength, rides, error } = this.state
    return !rides[selectedRideLength] && error === null
  }

  updateRideLength(selectedRideLength) {
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
        <p className='flex-center'>Select a ride you've taken to battle a friend.</p>
        { this.isLoading() && <p className='center-text'>LOADING</p>}
        { error && <p className='center-text error'>{error}</p>}
        { rides[selectedRideLength] && <RidesGrid rides={rides[selectedRideLength]} /> }
      </React.Fragment>
    )
  }
}