const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('./s3-connect.js');

const port = 5500;
const priceServer = 'http://localhost:3000';
const titleServer = 'http://localhost:2002';
const reviewsServer = 'http://localhost:4000';
const summaryServer = 'http://localhost:1220';

app.use(express.static(path.join(__dirname, '..', '/public')));

app.get('/files/:fileName', async (req, res) => {
  const fileName = req.params.fileName;
  console.log('== getting s3 file ==>', fileName);
  let key;
  if (!fileName) {
    res.end();
  }
  if (fileName.split('.')[1] === 'js') {
    key = 'scripts/' + fileName;
  } else if (fileName === 'style.css') {
    key = 'styles/summary-styles/' + fileName;
  } else if (fileName === 'styles.css') {
    key = 'styles/price-styles/' + fileName;
  } else {
    res.end();
  }

  const readFile = async (key) => {
    const convertToStr = (stream) => {
      return new Promise((resolve, reject) => {
        let data = [];
        stream.on('data', (chunk) => data.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(data).toString('utf8')));
      });
    }

    try {
      // data returned as readable string
      const data = await s3.send(new GetObjectCommand({Bucket: 'rpt27-fec-audible', Key: key}));

      const readData = await convertToStr(data.Body);
      return readData;
    } catch (err) {
      console.log("Error! ", err);
    }
  };

  const file = await readFile(key);
  res.send(file);

});


app.all('/api/price/*', (req, res) => {
  const url = (priceServer + req.path).trim();
  console.log('proxying request to price server with method', req.method, 'directed to', url);
  axios({
    method: req.method,
    url: url
  })
    .then((response) => {
      res.send(JSON.stringify(response.data));
    });
});
app.all('/api/book/*', (req, res) => {
  const url = (titleServer + req.path).trim();
  console.log('proxying request to title server with method', req.method, 'directed to', url);
  axios({
    method: req.method,
    url: url
  })
    .then((response) => {
      res.send(JSON.stringify(response.data));
    });
});
app.all('/api/books', (req, res) => {
  const url = (titleServer + req.path).trim();
  console.log('proxying request to title server with method', req.method, 'directed to', url);
  axios({
    method: req.method,
    url: url
  })
    .then((response) => {
      res.send(JSON.stringify(response.data));
    });
});
app.all('/reviews/*', (req, res) => {
  const url = (reviewsServer + req.path).trim();
  console.log('proxying request to reviews server with method', req.method, 'directed to', url);
  axios({
    method: req.method,
    url: url
  })
    .then((response) => {
      res.send(JSON.stringify(response.data));
    });
});
app.all('/api/summary/*', (req, res) => {
  const url = (summaryServer + req.path).trim();
  console.log('proxying request to summary server with method', req.method, 'directed to', url);
  axios({
    method: req.method,
    url: url
  })
    .then((response) => {
      res.send(JSON.stringify(response.data));
    });
});


app.listen(port, () => {
  console.log(`Proxy listening on http://localhost:${port}`)
})