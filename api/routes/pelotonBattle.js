var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

const BASE_URL = process.env.PELOTON_API_BASE_URL;
const BASE_HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': process.env.PELOTON_USER_AGENT,
  'peloton-platform': 'web' // Required Peloton-Platform header for select endpoints
}

router.get('/authorize', async(req, res, next) => {  
  try {
    // TODO: Get user & pw off request 
    const payload = {
      'username_or_email': process.env.PELOTON_AUTH_USER,
      'password': process.env.PELOTON_AUTH_PW
    }

    // Auth to Peloton API with login creds
    const resp = await fetch(BASE_URL + '/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: BASE_HEADERS
    });
    const respJSON = await resp.json();

    // Save this somewhere for app to use while user is logged in
    req.session.pelotonSessionId = respJSON.session_id
    req.session.pelotonUserId = respJSON.user_id;
    req.session.pelotonUsername = respJSON.user_data.username;

    // Set cookie to send in subsequent requests
    const pelotonHeaders = resp.headers.raw()['set-cookie'];
    req.session.pelotonSessionCookie = pelotonHeaders.join(';');
    
    res.json({ success: true });
  } catch (error) {
    console.log('In auth, error is: ', error);
  }

});

router.get('/rides', async(req, res, next) => {
  // Require authorization to proceed
  if (!req.session.pelotonSessionId) {
    res.sendStatus(401);
  } else {
    try {
      // Generate optional duration param to filter rides by class length
      const duration = req.query.duration ? `&duration=${req.query.duration}` : '';
      const headersWithCookies = Object.assign({}, BASE_HEADERS, { 'cookie' : req.session.pelotonSessionCookie });
      const ridesEndpoint = BASE_URL + `/api/v2/ride/archived?` +
        `browse_category=cycling`+
        `&content_format=audio,video` +
        `&limit=30` +
        `&page=0` +
        `&sort_by=original_air_time` +
        `&desc=true` +
        `&has_workout=true` +
        `&is_following_user_ride=true${duration}`;

      // Fetch Rides
      const ridesResponse = await fetch(ridesEndpoint, {
        headers: headersWithCookies
      });
      const ridesResponseJSON = await ridesResponse.json();
      
      let responseData = {
        'rides': []
      };

      ridesResponseJSON.data.forEach((ride) => {
        trimmedDownRide = {
          'id': ride.id,
          'instructorId': ride.instructor_id,
          'title': ride.title,
          'imageUrl': ride.image_url,
          'numFriends': ride.total_following_workouts,
          'duration': ride.duration,
          'classStartTimestamp': ride.scheduled_start_time
        }
        responseData.rides.push(trimmedDownRide)
      });

      res.json(responseData);

    } catch (error) {
      console.log('In /rides, error is: ', error);
    }   
  }

});


module.exports = router;
