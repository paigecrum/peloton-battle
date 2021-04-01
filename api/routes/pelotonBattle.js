var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

const BASE_URL = process.env.PELOTON_API_BASE_URL;
const BASE_HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': process.env.PELOTON_USER_AGENT,
  'peloton-platform': 'web' // Required Peloton-Platform header for select endpoints
}

const requireAuth = (req, res, next) => {
  const { pelotonSessionId } = req.session;
  if (!pelotonSessionId) {
    return res.status(401).json({message: 'Unauthorized'});
  }
  next();
}

router.post('/authorize', async(req, res, next) => {
  try {
    const payload = {
      'username_or_email': req.body.username,
      'password': req.body.password
    }

    // Auth to Peloton API with login creds
    const resp = await fetch(BASE_URL + '/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: BASE_HEADERS
    });
    const respJSON = await resp.json();

    req.session.pelotonSessionId = respJSON.session_id
    req.session.pelotonUserId = respJSON.user_id;
    req.session.pelotonUsername = respJSON.user_data.username;

    // Set cookie to send in subsequent requests
    const pelotonHeaders = resp.headers.raw()['set-cookie'];
    req.session.pelotonSessionCookie = pelotonHeaders.join(';');

    res.json({
      success: true,
      user: {
        id: req.session.pelotonUserId,
        username: req.session.pelotonUsername
      }
    });
  } catch (error) {
    console.log('In auth, error is: ', error);
    res.status(400).json({message: 'Peloton authentication failed.'});
  }
});

router.get('/rides', requireAuth, async(req, res, next) => {
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
});

router.get('/ride/:rideId', requireAuth, async(req, res, next) => {
  try {
    const rideId = req.params.rideId;
    const headersWithCookies = Object.assign({}, BASE_HEADERS, { 'cookie' : req.session.pelotonSessionCookie });
    const rideEndpoint = BASE_URL + `/api/ride/${rideId}`;

    const rideResponse = await fetch(rideEndpoint, {
      headers: headersWithCookies
    });
    const rideResponseJSON = await rideResponse.json();

    res.json({
      'id': rideResponseJSON.id,
      'instructorId': rideResponseJSON.instructor_id,
      'title': rideResponseJSON.title,
      'imageUrl': rideResponseJSON.image_url,
      'numFriends': rideResponseJSON.total_following_workouts,
      'duration': rideResponseJSON.duration,
      'classStartTimestamp': rideResponseJSON.scheduled_start_time
    });
  } catch (error) {
    console.log('In /ride, error is: ', error);
  }
});

router.get('/ride/:rideId/opponents', requireAuth, async(req, res, next) => {
  try {
    const rideId = req.params.rideId;
    const headersWithCookies = Object.assign({}, BASE_HEADERS, { 'cookie' : req.session.pelotonSessionCookie });
    const otherRidersEndpoint = BASE_URL + `/api/ride/${rideId}/recent_following_workouts?limit=100`;

    // Get list of friends who have taken this ride
    const otherRidersResponse = await fetch(otherRidersEndpoint, {
      headers: headersWithCookies
    });
    const otherRidersResponseJSON = await otherRidersResponse.json();

    let opponents = {};

    for (let rider of otherRidersResponseJSON.data) {
      const userId = rider.user_id;

      // Get user details for name, username, avatar
      const userResponse = await fetch(BASE_URL + `/api/user/${userId}`, {
        headers: headersWithCookies
      });
      const userResponseJSON = await userResponse.json();

      let username = userResponseJSON.username;
      let opponent = {
        'userId': userId,
        'rideId': rideId,
        'username': username,
        'deviceType': rider.device_type,
        'location': userResponseJSON.location,
        'avatarUrl': userResponseJSON.image_url,
        'totalWork': rider.total_work,
        'startedClassAt': rider.start_time,
        'workoutId': rider.id
      };

      opponents[username] = opponent;
    }

    res.json({
      'opponents': opponents
    });
  } catch (error) {
    console.log('In /ride/:rideId/opponents, error is: ', error);
  }
});

router.get('/workout/:workoutId', requireAuth, async(req, res, next) => {
  try {
    const workoutId = req.params.workoutId;
    const headersWithCookies = Object.assign({}, BASE_HEADERS, { 'cookie' : req.session.pelotonSessionCookie });
    const workoutEndpoint = BASE_URL + `/api/workout/${workoutId}`;

    // Get workout metadata
    const workoutDetailsResponse = await fetch(workoutEndpoint, {
      headers: headersWithCookies
    });
    const workoutDetailsJSON = await workoutDetailsResponse.json();


    // Get workout performance metrics
    const performanceMetricsResponse = await fetch(workoutEndpoint + `/performance_graph`, {
      headers: headersWithCookies
    });
    const performanceMetricsJSON = await performanceMetricsResponse.json();

    // Pull total output out of metrics summaries for ease of use
    let totalOutput = null;
    for (let metric of performanceMetricsJSON.summaries) {
      if (metric.slug === 'total_output') {
        totalOutput = metric.value;
      }
    }

    res.json({
      'userId': workoutDetailsJSON.user_id,
      'startedClassAt': workoutDetailsJSON.start_time,
      'workoutId': workoutId,
      'deviceType': workoutDetailsJSON.device_type,
      'stats': {
        'averageSummaries': performanceMetricsJSON.average_summaries,
        'summaries': performanceMetricsJSON.summaries
      },
      'totalOutput': totalOutput
    });
  } catch (error) {
    console.log('In /workout, error is: ', error);
  }
});

router.get('/user/:userId', requireAuth, async(req, res, next) => {
  try {
    const userId = req.params.userId;
    const headersWithCookies = Object.assign({}, BASE_HEADERS, { 'cookie' : req.session.pelotonSessionCookie });
    const userEndpoint = BASE_URL + `/api/user/${userId}`;

    const userResponse = await fetch(userEndpoint, {
      headers: headersWithCookies
    });
    const userResponseJSON = await userResponse.json();

    let responseData = {
      'userId': userResponseJSON.id,
      'username': userResponseJSON.username,
      'name': userResponseJSON.name,
      'avatarUrl': userResponseJSON.image_url,
      'location': userResponseJSON.location,
      'totalFollowers': userResponseJSON.total_followers,
      'totalFollowing': userResponseJSON.total_following,
      'totalWorkouts': userResponseJSON.total_workouts
    };

    // Get PRs from '/overview' endpoint
    const userOverviewResponse = await fetch(userEndpoint + `/overview`, {
      headers: headersWithCookies
    });
    const userOverviewJSON = await userOverviewResponse.json();

    responseData.personalRecords = userOverviewJSON.personal_records;

    res.json(responseData);
  } catch (error) {
    console.log('In /user, error is: ', error);
  }
});

router.get('/user/:userId/workouts', requireAuth, async(req, res, next) => {
  try {
    const userId = req.params.userId;
    const limit = req.query.limit;
    const headersWithCookies = Object.assign({}, BASE_HEADERS, { 'cookie' : req.session.pelotonSessionCookie });
    const userWorkoutsEndpoint = BASE_URL + `/api/user/${userId}/workouts`;
    // Generate optional query params to filter workouts
    const page = req.query.page ? `&page=${req.query.page}` : '';
    const joins = req.query.joins ? `&joins=${req.query.joins}` : '';

    // Get workouts
    const userWorkoutsResponse = await fetch(userWorkoutsEndpoint + `?limit=${limit}${page}${joins}`, {
      headers: headersWithCookies
    });
    const userWorkoutsJSON = await userWorkoutsResponse.json();

    let workouts = [];
    for (workout of userWorkoutsJSON.data) {
      let data = {
        'userId': workout.user_id,
        'workoutId': workout.id,
        'isPersonalRecord': workout.is_total_work_personal_record,
        'totalWork': workout.total_work,
        'startTime': workout.start_time,
        'fitnessDiscipline': workout.fitness_discipline,
        'deviceType': workout.device_type,
        'rideId': workout?.ride?.id,
        'rideTitle': workout?.ride?.title,
        'rideImageUrl': workout?.ride?.image_url,
        'instructorId': workout?.ride?.instructor_id,
        'scheduledStartTime': workout?.ride?.scheduled_start_time
      }
      workouts.push(data);
    }

    let responseData = {
      'page': userWorkoutsJSON.page,
      'limit': userWorkoutsJSON.limit,
      'total': userWorkoutsJSON.total,
      'pageCount': userWorkoutsJSON.page_count,
      'workouts': workouts
    }

    res.json(responseData);
  } catch (error) {
    console.log('In /user/:userId/workouts, error is: ', error);
  }
});


module.exports = router;
