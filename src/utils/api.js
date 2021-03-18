
export function getRides(rideLength) {
  const durationParam = rideLength ? `?duration=${rideLength}` : '';
  const endpoint = `${process.env.REACT_APP_API_ENDPOINT}${durationParam}`;

  return fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      return data.rides
    })
}

export function getRide(rideId) {
  // TODO: Replace with fetch endpoint

  return {
    'title': '30 Min Pop Ride', // title
    'id': rideId,
    'instructorId': 'baf5dfb4c6ac4968b2cb7f8f8cc0ef10', // instructor_id
    'imageUrl': 'https://s3.amazonaws.com/peloton-ride-images/5d7db7ada284cad1a499848aa0bbdf5b05f1e994/img_1608685494_0387c63667d540218dbffcde019e169b.png', // image_url
    'classStartTimestamp': 1608683400, // scheduled_start_time
    'numFriends': 3, // total_following_workouts
    'friends': [ // from /recent_following_workouts endpoint
      {
        'name': 'Spencer Crum',
        'id': 124,
        'avatar': ''
      },
      {
        'name': 'Shannon Thiery',
        'id': 456,
        'avatar': ''
      },
      {
        'name': 'CaraJo Knapp',
        'id': 789,
        'avatar': ''
      }
    ]
  }
}