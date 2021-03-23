import React from 'react'
import { Link } from 'react-router-dom'

import { getRideMetadata, getRideOpponents } from '../utils/api'
import { formatDate, instructorMap } from '../utils/helpers'

export default class Ride extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ride: null,
      opponents: [],
      error: null,
      loadingRide: true,
      loadingOpponents: true
    }
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
      <React.Fragment>
        { loadingRide === true
          ? <h1 className='center-text'>Loading Ride...</h1>
          : <React.Fragment>
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
            </React.Fragment>
        }
        { loadingOpponents === true
          ? loadingRide === false && <h1 className='center-text'>Loading Opponents...</h1>
          : <React.Fragment>
              <p className='center-text'>Pick one of your {Object.keys(opponents).length} friends who has taken this ride to battle.</p>
              <ul className='grid space-around'>
                { Object.keys(opponents).map((opponentUsername) => {
                  return (
                    <li key={opponents[opponentUsername].userId}>
                      <Link
                        className=''
                        to={{
                          pathname: `/battle/${opponents[opponentUsername].rideId}`,
                          search: `?opponent=${opponents[opponentUsername].username}`,
                          state: {
                            ride,
                            opponent: opponents[opponentUsername]
                          }
                        }}
                      >
                        <img
                          className='card-test round'
                          src={opponents[opponentUsername].avatarUrl}
                          alt='Avatar for friend'
                        />
                        <p>{opponents[opponentUsername].username}</p>
                        <p>{opponents[opponentUsername].location}</p>
                        <p>{`Taken on ${formatDate(opponents[opponentUsername].startedClassAt)}`}</p>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </React.Fragment>
        }

      </React.Fragment>
    )
  }
}