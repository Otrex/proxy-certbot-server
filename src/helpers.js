const { createClient } = require('redis');
const { exec } = require('child_process');
const Queue = require('bull');

exports.client = createClient();
exports.queue = new Queue("x-certbot-queue")
exports.queue.client = exports.client;

async function Certbot(subdomain) {
  const certbotProcess = exec(`sudo bash ./cert.sh ${subdomain}.useagencyai.com ${process.env.ENV}`);
  return new Promise((resolve, reject) => {
    certbotProcess.on('exit', (code) => code === 0 
      ? resolve() 
      : reject(new Error(`Certbot process exited with code ${code}`)))
  });
}

exports.queue.process(function (job, done) {
  console.log(`${new Date()} - processing ${JSON.stringify(job.data)}`);
  return Certbot(job.data.subdomain).then(done).catch((err) => job.moveToFailed({ message: err.message }))
})

exports.queue.on('error', function (error) {
  console.log(`${new Date()} - Certbot Error: ${error}`);
})

exports.queue.on('completed', function (job, result) {
  // A job successfully completed with a `result`.
  job.remove();
})

exports.ConnectToRedis = async () => {
  exports.client.on('error', err => {throw err});
  await exports.client.connect();
}

