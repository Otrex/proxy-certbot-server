const http = require('http');
const httpProxy = require('http-proxy');
const { client } = require("./helpers");

const proxy = httpProxy.createProxyServer({});

const server = http.createServer(async (req, res) => {
  try {
    const host = req.headers.host;
    const subdomain = host.split('.')[0];

    console.log(host, subdomain);

    const target = await client.get(subdomain);
    
    if (target) {
      proxy.web(req, res, { target });
    } else {
      console.log("- Subdomain: " + target);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } catch (error) {
    console.error('- Proxy Server Error:: ', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

module.exports = server;