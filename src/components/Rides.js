import React from 'react'
import PropTypes from 'prop-types'

// import { getRides } from '../utils/api'

function RideLengthNav({selected, onUpdateRideLength}) {
  const rideLengths = ['All', '20 min', '30 min', '45 min', '60 min'];

  return (
    <ul className='flex-center'>
      { rideLengths.map((rideLength) => (
        <li key={rideLength}>
          <button 
            className='btn-clear nav-link'
            style={ 
              rideLength === selected
              ? { color: '#5393fe'}
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

export default class Rides extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedRideLength: 'All'
    }

    this.updateRideLength = this.updateRideLength.bind(this)
  }

  updateRideLength(selectedRideLength) {
    this.setState({
      selectedRideLength
    })
  }

  render() {
    const { selectedRideLength } = this.state

    return (
      <React.Fragment>
        <RideLengthNav
          selected={ selectedRideLength }
          onUpdateRideLength={ this.updateRideLength }
        />
        <p className='flex-center'>Select a ride you've taken to battle a friend.</p>
      </React.Fragment>
    )
  }
}