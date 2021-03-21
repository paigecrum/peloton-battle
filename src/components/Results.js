import React from 'react'
// import queryString from 'query-string'

import { getRideMetadata, battle } from '../utils/api'
import { formatDate, instructorMap } from '../utils/helpers'

export default class Results extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ride: null,
      winner: null,
      loser: null,
      loadingRide: true,
      loadingPlayers: true,
      error: null
    }
  }

  componentDidMount() {    
    // const { opponent } = queryString.parse(this.props.location.search);
    const { rideId } = this.props.match.params;

    // TODO: Fetch playerOne from logged in user, hardcoding for now
    const appUser = {
      'userId': 'PaigeMicheloton',
      'workoutId': 'e02ee550ec824bd28fa02fbfa1513e07'
    };

    // TODO: Conditionally fetch opponent if we don't have it from Link state
    const opponent = {
      'userId': 'alexlonglegs',
      'workoutId': 'ea73670d54e947f493818ae3eeb9315c'
    };

    // Conditionally fetch ride if not navigating via ride details page
    if (!this.props.location.state) {
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
    } else {
      this.setState({
        ride: this.props.location.state.ride,
        loadingRide: false
      })
    }

    battle([appUser, opponent])
      .then((players) => {
        this.setState({
          winner: players[0],
          loser: players[1],
          error: null,
          loadingPlayers: false
        })
      })
      .catch((error) => {
        console.warn(error);

        this.setState({
          error: 'There was an error battling your opponent.',
          loadingPlayers: false
        })
      })

    // TODO: extract getRideMetadata() and battle() calls for readability 
  }

  render() {
    const { ride, winner, loser, loadingRide, loadingPlayers, error } = this.state;

    if (error) {
      return (
        <p className='center-text error'>{error}</p>
      )
    }

    return (
      <React.Fragment>
        <h1 className='center-text'>Battle Results!</h1>

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

        { loadingPlayers === true
          ? loadingRide === false && <h1 className='center-text'>Battling...</h1>
          : <React.Fragment>
              <div className='grid space-around container-sm'>
                <div>
                  <h3>Winner: {winner.username}</h3>
                  <img
                    className='card-test round'
                    src={winner.avatarUrl}
                    alt='Avatar for battle winner'
                  />
                  <p>Date Taken: {formatDate(winner.startedClassAt)}</p>
                  { winner.stats.summaries.map((stat) => (
                    <p key={stat.slug}>{stat.display_name}: {stat.value} {stat.display_unit}</p>
                  ))}
                </div>
                <div>
                  <h3>Loser: {loser.username}</h3>
                  <img
                    className='card-test round'
                    src={loser.avatarUrl}
                    alt='Avatar for battle loser'
                  />
                  <p>Date Taken: {formatDate(loser.startedClassAt)}</p>
                  { loser.stats.summaries.map((stat) => (
                    <p key={stat.slug}>{stat.display_name}: {stat.value} {stat.display_unit}</p>
                  ))}
                </div>
              </div>
            </React.Fragment>
        }

      </React.Fragment>
    )
  }
}