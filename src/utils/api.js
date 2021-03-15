
export function getRides(rideLength) {
  const durationParam = rideLength ? `?duration=${rideLength}` : '';
  const endpoint = `${process.env.REACT_APP_API_ENDPOINT}${durationParam}`;

  return fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      return data.rides
    })
}