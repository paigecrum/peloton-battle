
export function getRides(rideLength) {
  const durationParam = rideLength ? `?duration=${rideLength}` : '';
  const endpoint = `${process.env.REACT_APP_API_ENDPOINT}/rides${durationParam}`;

  return fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      return data.rides
    })
}

export function getRide(rideId) {
  const endpoint = `${process.env.REACT_APP_API_ENDPOINT}/ride/${rideId}`;

  return fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      return data.friends
    })
}