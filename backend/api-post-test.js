const http = require('http');

const data = JSON.stringify({
  vid: 'VOTER-UI-TEST-2',
  aadhar: '333344445555',
  name: 'UI Test 2',
  phone: '9999000044',
  dob: '1993-03-03',
  gender: 'female',
  address: 'UI test address 2'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/voters',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  let body = '';
  res.setEncoding('utf8');
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(data);
req.end();
