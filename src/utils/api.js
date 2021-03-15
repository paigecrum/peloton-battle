
// mock ride data for now
const data1 = {
  metadata: 'sup',
  rides: [
    {
      'id': '1',
      'title': '20 min Rock Ride',
      'instructor': 'Denis Morton',
      'date': 'Monday',
      'friends': 2,
      'imageUrl': 'https://s3.amazonaws.com/peloton-ride-images/0ebd52d1d0abae68768aa0819be2a9a61b3fe98f/img_1603377871_f56d1496b4084fcf9d181a1b92ff1edb.jpg'
    },
    {
      'id': '2',
      'title': '45 min Pop Ride',
      'instructor': 'Cody Rigsby',
      'date': 'Tuesday',
      'friends': 4,
      'imageUrl': 'https://s3.amazonaws.com/peloton-ride-images/cca38e04c2bde7db300ab80351e79d7bd9723c37/img_1612279517_6513185b3722401e8a8923540a3c8156.png'
    },
  ]
}

const data2 = {
  metadata: 'sup',
  rides: [
    {
      'id': '1',
      'title': '20 min Rock Ride',
      'instructor': 'Denis Morton',
      'date': 'Monday',
      'numFriends': 2,
      'imageUrl': 'https://s3.amazonaws.com/peloton-ride-images/325eddbac12bcd9e2991b4007e8e266c8945746c/img_1605807056_bbe3b42dc0ee4aff9ecde4e54313548e.jpg'
    },
    {
      'id': '2',
      'title': '45 min Pop Ride',
      'instructor': 'Cody Rigsby',
      'date': 'Tuesday',
      'numFriends': 4,
      'imageUrl': 'https://s3.amazonaws.com/peloton-ride-images/1a5663cb898b2553cef24aeb49d9b80582390057/img_1607014873_6b6363399f7d4aa1956c356b03e33817.png'
    },
    {
      'id': '3',
      'title': '30 min Classic Rock Ride',
      'instructor': 'Denis Morton',
      'date': 'Monday',
      'numFriends': 2,
      'imageUrl': 'https://s3.amazonaws.com/peloton-ride-images/325eddbac12bcd9e2991b4007e8e266c8945746c/img_1605807056_bbe3b42dc0ee4aff9ecde4e54313548e.jpg'
    },
    {
      'id': '4',
      'title': '45 min Britney Ride',
      'instructor': 'Cody Rigsby',
      'date': 'Tuesday',
      'numFriends': 4,
      'imageUrl': 'https://s3.amazonaws.com/peloton-ride-images/1a5663cb898b2553cef24aeb49d9b80582390057/img_1607014873_6b6363399f7d4aa1956c356b03e33817.png'
    },
    {
      'id': '5',
      'title': '15 min Power Zone Endurance Ride',
      'instructor': 'Denis Morton',
      'date': 'Monday',
      'numFriends': 2,
      'imageUrl': 'https://s3.amazonaws.com/peloton-ride-images/325eddbac12bcd9e2991b4007e8e266c8945746c/img_1605807056_bbe3b42dc0ee4aff9ecde4e54313548e.jpg'
    },
    {
      'id': '6',
      'title': '6',
      'instructor': 'Cody Rigsby',
      'date': 'Tuesday',
      'numFriends': 4,
      'imageUrl': 'https://s3.amazonaws.com/peloton-ride-images/1a5663cb898b2553cef24aeb49d9b80582390057/img_1607014873_6b6363399f7d4aa1956c356b03e33817.png'
    }
  ]
}

export function getRides(rideLength) {
  // TODO: Replace with API Gateway call

  if (rideLength === 1200) {
    return data1.rides;
  } else {
    return data2.rides;
  }

}