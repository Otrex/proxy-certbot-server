const express = require('express');
const cors = require('cors');

const {
  client, 
  queue
} = require("./helpers");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/add-subdomain", async (req, res) => {
  try {
    const { port, subdomain } = {...req.body, ...req.query};
    console.log({ port, subdomain })
    if (port === undefined || subdomain === undefined) {
      console.log(req.body, req.query);
      return res.status(422).send("invalid port or subdomain");
    }

    const exist = await client.get(subdomain);
    if (exist) return res.status(200).send("subdomain already exists");

    await client.set(subdomain, `http://localhost:${port}`);
    queue.add({ subdomain });
    return res.status(200).send('OK');
  } catch (error) {
    res.status(500).send("something went wrong")
    console.error("- Domain Server Error:: ", error);
  }
})

module.exports = app;