import { useContext, useEffect, useReducer } from 'react'
import { useLocation } from 'react-router-dom'

import { ApiContext } from '../contexts/api'

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
  const { getRideMetadata } = useContext(ApiContext);
  const location = useLocation();
  const [rideState, dispatchRide] = useReducer(
    rideReducer,
    { ride: null, rideError: null, loadingRide: true }
  );

  useEffect(() => {
    const fetchAndUpdateRideMetadata = async () => {
      // Conditionally fetch ride if not navigating via ride details page
      if (!location.state) {
        try {
          const ride = await getRideMetadata(rideId);
          dispatchRide({ type: 'success', ride });
        } catch (error) {
          console.warn('Error fetching ride: ', error);
          dispatchRide({ type: 'error', error: 'There was an error fetching ride from the ride ID param.' });
        }
      } else {
        dispatchRide({ type: 'success', ride: location.state.ride });
      }
    }

    fetchAndUpdateRideMetadata();
  }, [location.state, getRideMetadata, rideId])

  return rideState;
}
