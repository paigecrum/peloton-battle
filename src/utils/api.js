
export function getRides(rideLength) {
  const durationParam = rideLength ? `?duration=${rideLength}` : '';
  const endpoint = `${process.env.REACT_APP_API_ENDPOINT}/rides${durationParam}`;

  return fetch(endpoint)
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
