import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export const options = {
  vus: 1000,
  iterations: 3500,
  thresholds: {
    'http_req_duration': ['avg < 2000'], // respons harus di bawah 2 detik
    'http_req_failed': ['rate < 0.01'], // error kurang dari 1%
  },
};


const BASE_URL = 'https://reqres.in/api';

export default function () {
  // Payload for POST request
  const postPayload = JSON.stringify({
    name: 'morpheus',
    job: 'leader'
  });

  // Params for POST request
  const postParams = {
    headers: { 
        'Content-Type': 'application/json',
     },
  };

    
    // Test POST request
    const postRes = http.post(`${BASE_URL}/users`, postPayload, postParams);
    
    //Assertion
    check(postRes, {
      'POST status is 201': (r) => r.status === 201,
      'POST response contains ID': (r) => JSON.parse(r.body).id !== undefined ,
    });

    // Extracting ID from POST response
    const userId = JSON.parse(postRes.body).id;

    sleep(1);
  //});



  // Payload for PUT request
  const putPayload = JSON.stringify({
    name: 'morpheus',
    job: 'zion resident'
  });

  // Params for PUT request
  const putParams = {
    headers: { 
        'Content-Type': 'application/json',
     },
  };


    
    // Test PUT request
    const putRes = http.put(`${BASE_URL}/users/${userId}`, putPayload, putParams);
    
    //Assertion
    check(putRes, {
      'PUT status is 200': (r) => r.status === 200,
      'PUT response contains updated name': (r) => JSON.parse(r.body).name === 'morpheus',
    });

    sleep(1);
  //});
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}
