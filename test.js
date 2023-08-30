const Queue = require('bull');
const express = require('express');
const cors = require('cors');
const { client, ConnectToRedis } = require('./src/helpers');

const app = express();

const queue = new Queue('certbot');

queue.client = client;
app.use(cors());
app.use(express.json());

queue.process(function (job, done) {
  console.log(console.log(job));
  return delay().then(done).catch()
})

queue.on('error', function (error) {
  // An error occured.
})

let i = 0;
const delay = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('running....')
      resolve();
    }, 1000)
  })
}

app.get('/api', async (req, res) => {
  queue.add({ data: i + "" + req.query.a })
  return res.send('ok')
})


ConnectToRedis().then(() => {
  app.listen(3300, () => console.log("started"))
})