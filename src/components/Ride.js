import React from 'react'
import { Link } from 'react-router-dom'

import { getRideOpponents } from '../utils/api'
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

    getRideOpponents(rideId)
      .then((opponents) => {
        this.setState(({ ride }) => {
          return {
            ride: {
              ...ride,
              opponents
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
    const { ride, loading, error } = this.state;

    if (loading === true) {
      return <h1 className='center-text'>Loading...</h1>
    }

    if (error) {
      return (
        <p className='center-text error'>{error}</p>
      )
    }

    return (
      <React.Fragment>
        <div>
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
          { Object.keys(ride.opponents).map((opponentUsername) => {
            return (
              <li key={ride.opponents[opponentUsername].userId}>
                <Link
                  className=''
                  to={{
                    pathname: `/battle/${ride.opponents[opponentUsername].rideId}`,
                    search: `?opponent=${ride.opponents[opponentUsername].username}`,
                    state: {
                      ride,
                      opponent: ride.opponents[opponentUsername]
                    }
                  }}
                >
                  <img
                    className='card-test round'
                    src={ride.opponents[opponentUsername].avatarUrl}
                    alt='Avatar for friend'
                  />
                  <p>{ride.opponents[opponentUsername].username}</p>
                  <p>{ride.opponents[opponentUsername].location}</p>
                  <p>{`Taken on ${formatDate(ride.opponents[opponentUsername].startedClassAt)}`}</p>
                </Link>
              </li>
            )
          })}
        </ul>

      </React.Fragment>
    )
  }
}