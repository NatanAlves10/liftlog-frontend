const BASE_URL = 'http://192.168.1.221:8080';

export default {
  login: `${BASE_URL}/login`,
  register: `${BASE_URL}/register`,
  workouts: `${BASE_URL}/api/workouts`,
  exercises: `${BASE_URL}/api/exercises`,
  workoutSessions: `${BASE_URL}/api/workout-sessions`,
  userProfile: `${BASE_URL}/api/users/self`,
  updateUser: `${BASE_URL}/api/users`,
};