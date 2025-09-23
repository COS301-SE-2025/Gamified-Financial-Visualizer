import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { randomString, randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
  stages: [
    { duration: '30s', target: 50 }, // Ramp-up to 50 users in 30 seconds
    { duration: '1m', target: 50 },  // Hold at 50 users for 1 minute
    { duration: '30s', target: 0 },  // Ramp-down to 0 users in 30 seconds
  ],
};

// Function to register a user
function registerUser() {
     const email = `user_${__VU}_${Date.now()}@example.com`;
   const username = `user_${randomString(7)}`;
  const payload = JSON.stringify({
    full_name: 'John Doe',
    username: username,
    email: email,
    password: 'StrongPassword1!',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = http.post('http://localhost:5000/api/auth/register', payload, params);

  if (response.status !== 201) {
    console.error(`Registration failed: ${response.status} - ${response.body}`);
  }

  // clean up by deleting the user if registration was successful
   if (response.status === 201) {
      const userId = response.json().data.user.id;
      const deleteResponse = http.del(`http://localhost:5000/api/auth/delete/${userId}`);
      if (deleteResponse.status !== 200) {
          console.error(`User deletion failed: ${deleteResponse.status} - ${deleteResponse.body}`);
      }
  }
  check(response, {
    'is status 201': (r) => r.status === 201,
    'registration successful': (r) => r.body.includes('User registered successfully'),
  });
}

// Function to login the user
function loginUser() {

   // register a user to ensure the user exists before login
   const email = `user_${__VU}_${Date.now()}@example.com`;
   const usernameReg = `user_${randomString(7)}`;
  const registerPayload = JSON.stringify({
    full_name: 'John Doe',
    username: usernameReg,
    email: email,
    password: 'StrongPassword1!',
  });
  
  const registerParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
   const registerResponse = http.post('http://localhost:5000/api/auth/register', registerPayload, registerParams);
   if (registerResponse.status !== 201) {
     console.error(`User registration failed: ${registerResponse.status} - ${registerResponse.body}`);
     return;
   }
  const username = usernameReg;
  const password = 'StrongPassword1!';

  const payload = JSON.stringify({
  username: username,
  password: password
});


  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = http.post('http://localhost:5000/api/auth/login', payload, params);
console.log(response.body);

  if (response.status !== 200) {
    console.error(`Login failed: ${response.status} - ${response.body}`);
  }
  check(response, {
    'is status 200': (r) => r.status === 200,
    'login successful': (r) => r.body.includes('success'),
  });
}

// Function to get the user's profile top bar data
function getProfileTopBar() {
  const userId = 1; // Use a valid userId, adjust this dynamically if needed

  const response = http.get(`http://localhost:5000/api/auth/top-bar/${userId}`);

  check(response, {
    'is status 200': (r) => r.status === 200,
    'profile top bar loaded': (r) => r.body.includes('Profile top bar data loaded'),
  });
}

export default function () {
//   group('User Registration', () => {
//     registerUser();
//     sleep(1); // simulate user think time
//   });

  group('User Login', () => {
    loginUser();
    sleep(1); // simulate user think time
  });

  group('Fetch User Profile', () => {
    getProfileTopBar();
    sleep(1); // simulate user think time
  });
}
