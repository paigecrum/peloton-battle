import React from 'react'

import { getRide } from '../utils/api'
import { formatDate, instructorMap } from '../utils/helpers'

export default class Ride extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ride: this.props.location.state.ride,
      error: null,
      loading: true
    }
  }

  componentDidMount() {
    const { rideId } = this.props.match.params;

    // TODO: Rename to reflect that it's just getting the opponents' info
    getRide(rideId)
    .then((friends) => {
      this.setState(({ ride }) => {
        return {
          ride: {
            ...ride,
            friends
          },
          error: null,
          loading: false
        }
      })
    })
    .catch((error) => {
      console.warn('Error fetching ride info: ', error)

      this.setState({
        error: 'There was an error fetching your ride info.'
      })
    })
  }

  render() {
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
          { Object.keys(ride.friends).map((friendId) => {
            return (
              <li key={ride.friends[friendId].id}>
                <img
                  className='card-test round'
                  src={ride.friends[friendId].avatarUrl}
                  alt='Avatar for friend'
                />
                <p>{ride.friends[friendId].username}</p>
                <p>{`Taken on ${formatDate(ride.friends[friendId].startedClassAt)}`}</p>
              </li>
            )
          })}
        </ul>

      </React.Fragment>
    )
  }
}