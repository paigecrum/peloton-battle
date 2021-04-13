
export function authorize(data) {
  const endpoint = `/api/authorize`;

  return fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
    .then((res) => {
      if (!res.ok) {
        throw Error('Peloton authentication failed.');
      }
      return res.json()
    })
    .then((data) => {
      return data
    })
}

export function checkAuthStatus() {
  const endpoint = `/api/checkAuthStatus`;

  return fetch(endpoint)
    .then((res) => {
      if (!res.ok) {
        throw Error('Auth status check failed');
      }
      return res.json()
    });
}

export function logout() {
  const endpoint = `/api/logout`;

  return fetch(endpoint, { method: 'POST' })
    .then((res) => {
      return res.json()
    })
}

export function getRides(rideLength) {
  const durationParam = rideLength ? `?duration=${rideLength}` : '';
  const endpoint = `/api/rides${durationParam}`;

  return fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      return data.rides
    })
}

export function getRideMetadata(rideId) {
  const endpoint = `/api/ride/${rideId}`;

  return fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      return data
    })
}

export function getRideOpponents(rideId) {
  const endpoint = `/api/ride/${rideId}/opponents`;

  return fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      return data.opponents
    })
}

function getPlayerRideStats(workoutId) {
  const endpoint = `/api/workout/${workoutId}`;

  return fetch(endpoint)
    .then((res) => res.json())
}

function sortPlayers(players) {
  return players.sort((a, b) => {
    return b.totalOutput - a.totalOutput;
  })
}

function getUserMetaInfo(userId) {
  const endpoint = `/api/user/${userId}`;

  return fetch(endpoint)
    .then((res) => res.json())
}

export async function getUserWorkout(userId, rideId) {
  const endpoint = `/api/user/${userId}/workouts?limit=100`;

  // Fetch endpoint initially to get page_count for looping
  let pageCountResponse = await fetch(endpoint);
  let pageCountResponseJSON = await pageCountResponse.json();
  let pageCount = pageCountResponseJSON.pageCount;

  for (let page = 0; page < pageCount; page++) {
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
