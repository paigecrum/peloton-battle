import React from 'react'

import { getRide } from '../utils/api'
import { formatDate, instructorMap } from '../utils/helpers'

export default class Ride extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ride: {},
      error: null,
      loading: true
    }
  }

  componentDidMount() {
    const { rideId } = this.props.match.params;

    let ride = getRide(rideId)

    this.setState({
      ride,
      error: null,
      loading: false
    })
  }

  render() {
    const { rideId } = this.props.match.params;
    const { ride, loading } = this.state;

    if (loading === true){
      return <h1 className='center-text'>Loading...</h1>
    }

    return (
      <React.Fragment>
        <div className=''>
          <img
            className='card-test'
            src={ride.imageUrl}
            alt='Thumbnail from selected ride.'
          />
          <h2 className='center-text'>{ride.title}</h2>
          <h3 className='center-text'>{instructorMap[ride.instructorId]}</h3>
          <p className='center-text'>
            {`Aired on ${formatDate(ride.classStartTimestamp)}`}
          </p>
        </div>
        <p className='center-text'>Pick one of your {ride.numFriends} friends who has taken this ride to battle.</p>  
        <ul className='grid space-around'>
          { ride.friends.map((friend) => (
            <li key={friend.id}>
              <img
                className='card-test round'
                src={ride.imageUrl}
                alt='Thumbnail from selected ride.'
              />
              <p>{friend.name}</p>
            </li>
          ))}
        </ul>

      </React.Fragment>
    )
  }
}