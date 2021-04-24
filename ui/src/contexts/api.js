import React, { createContext, useEffect } from 'react';
import axios from 'axios';

const ApiContext = createContext();
const { Provider } = ApiContext;

const ApiProvider = ({ children }) => {
  const client = axios.create({
    baseURL: process.env.REACT_APP_API_URL
  });

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const { data } = await client.get('csrf-token');
        client.defaults.headers['X-CSRF-Token'] = data.csrfToken;
      } catch (error) {
        console.log('Error getting csrf token: ', error);
      }
    };

    getCsrfToken();
  }, [client]);

  const checkAuthStatus = async () => {
    const { data } = await client.get(`/checkAuthStatus`);
    return data;
  }

  const authorize = async (formData) => {
    const { data } = await client.post(`/authorize`, formData);
    return data;
  }

  const logout = async () => {
    const { data } = await client.post(`/logout`);
    return data;
  }

  const getRides = async (rideLength) => {
    const durationParam = rideLength ? `?duration=${rideLength}` : '';
    const endpoint = `/rides${durationParam}`;
    const { data } = await client.get(endpoint);
    return data;
  }

  const getRideMetadata = async (rideId) => {
    const { data } = await client.get(`/ride/${rideId}`);
    return data;
  }

  const getRideOpponents = async (rideId) => {
    const { data } = await client.get(`/ride/${rideId}/opponents`);
    return data.opponents;
  }

  const getPlayerRideStats = async (workoutId) => {
    const endpoint = `/api/workout/${workoutId}`;
    const { data } = await axios.get(endpoint);
    return data;
  }

  const getUserMetaInfo = async (userId) => {
    const endpoint = `/api/user/${userId}`;
    const { data } = await axios.get(endpoint);
    return data;
  }

  const getUserWorkout = async (userId, rideId) => {
    const endpoint = `/api/user/${userId}/workouts?limit=100`;

    // Fetch endpoint initially to get pageCount for looping
    let pageCountResponse = await axios.get(endpoint);
    let pageCount = pageCountResponse.data.pageCount;

    for (let page = 0; page < pageCount; page++) {
      let newResp = await axios.get(endpoint + `&joins=ride&page=${page}`);

      for (let workout of newResp.data.workouts) {
        if (workout.rideId === rideId) {
          return workout.workoutId;
        }
      }
    }
  }

  const getUserData = async (player) => {
    const [profile, stats] = await Promise.all([
      getUserMetaInfo(player.userId),
      getPlayerRideStats(player.workoutId)
    ]);
    return {
      ...profile,
      ...stats
    };
  }

  const sortPlayers = (players) => {
    return players.sort((a, b) => {
      return b.totalOutput - a.totalOutput;
    })
  }

  const battle = async (players) => {
    const results = await Promise.all([
      getUserData(players[0]),
      getUserData(players[1])
    ]);
    return sortPlayers(results);
  }

  return (
    <Provider value={{
      authorize,
      battle,
      checkAuthStatus,
      getRides,
      getRideMetadata,
      getRideOpponents,
      getUserWorkout,
      logout
    }}>
      {children}
    </Provider>
  );
};

export { ApiContext, ApiProvider };
