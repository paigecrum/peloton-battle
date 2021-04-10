import { useEffect, useReducer } from 'react'
import { useLocation } from 'react-router-dom'

import { getRideMetadata } from '../utils/api'

const rideReducer = (state, action) => {
  if (action.type === 'success') {
    return {
      ride: action.ride,
      rideError: null,
      loadingRide: false
    }
  } else if (action.type === 'error') {
    return {
      ...state,
      rideError: action.error,
      loadingRide: false
    }
  } else {
    throw new Error(`This action type isn't supported.`)
  }
}

export default function useRide(rideId) {
  const location = useLocation();
  const [rideState, dispatchRide] = useReducer(
    rideReducer,
    { ride: null, rideError: null, loadingRide: true }
  );

  useEffect(() => {
    // Conditionally fetch ride if not navigating via ride details page
    if (!location.state) {
      getRideMetadata(rideId)
        .then((ride) => {
          dispatchRide({ type: 'success', ride });
        })
        .catch((error) => {
          console.warn('Error fetching ride: ', error);
          dispatchRide({ type: 'error', error: 'There was an error fetching ride from the ride ID param.' });
        })
    } else {
      dispatchRide({ type: 'success', ride: location.state.ride });
    }
  }, [rideId, location.state])

  return rideState;
}
