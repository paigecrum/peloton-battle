
export function getRides(rideLength) {
  const durationParam = rideLength ? `?duration=${rideLength}` : '';
  const endpoint = `${process.env.REACT_APP_API_ENDPOINT2}/rides${durationParam}`;

  return fetch(endpoint, { 'credentials': 'include' })
    .then((res) => res.json())
    .then((data) => {
      return data.rides
    })
}

export function getRideMetadata(rideId) {
  const endpoint = `${process.env.REACT_APP_API_ENDPOINT}/ride/${rideId}`;

  return fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      return data
    })
}

export function getRideOpponents(rideId) {
  const endpoint = `${process.env.REACT_APP_API_ENDPOINT}/ride/${rideId}/opponents`;

  return fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      return data.opponents
    })
}

function getPlayerRideStats(workoutId) {
  const endpoint = `${process.env.REACT_APP_API_ENDPOINT}/workout/${workoutId}`;

  return fetch(endpoint)
    .then((res) => res.json())
}

function sortPlayers(players) {
  return players.sort((a, b) => {
    return b.totalOutput - a.totalOutput;
  })
}

function getUserMetaInfo(userId) {
  const endpoint = `${process.env.REACT_APP_API_ENDPOINT}?user=${userId}`;

  return fetch(endpoint)
    .then((res) => res.json())
}

export async function getUserWorkout(userId, rideId) {
  const endpoint = `${process.env.REACT_APP_API_ENDPOINT}/user/${userId}/workouts?limit=100`;

  // Fetch endpoint initially to get page_count for looping
  let pageCountResponse = await fetch(endpoint);
  let pageCountResponseJSON = await pageCountResponse.json();
  let page_count = pageCountResponseJSON.page_count;

  for (let page = 0; page < page_count; page++) {
    let newResp = await fetch(endpoint + `&joins=ride&page=${page}`);
    let newRespJSON = await newResp.json();

    for (let workout of newRespJSON.workouts) {
      if (workout.rideId === rideId) {
        return workout.workoutId;
      }
    }
  }
}

function getUserData(player) {
  return Promise.all([
    getUserMetaInfo(player.userId),
    getPlayerRideStats(player.workoutId)
  ]).then(([profile, stats]) => {
    return {
      ...profile,
      ...stats
    }
  })
}

export function battle(players) {
  return Promise.all([
    getUserData(players[0]),
    getUserData(players[1])
  ]).then((results) => sortPlayers(results))
}
