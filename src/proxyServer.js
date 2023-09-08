const http = require('http');
const httpProxy = require('http-proxy');
const { client } = require("./helpers");

const proxy = httpProxy.createProxyServer({});

const miniMap = {
  "one": "http://localhost:3002",
  "two": "http://localhost:3003",
  "three": "http://localhost:3004",
}

const server = http.createServer(async (req, res) => {
  try {
    const host = req.headers.host;
    const subdomain = host.split('.')[0];

    console.log(host, subdomain);

    const target = await client.get(subdomain);
    
    if (target) {
      proxy.web(req, res, { target });
    } else if (["one", "two", "three"].includes(subdomain.split('-')[0].replace("ai", ''))) {
      proxy.web(req, res, { target: miniMap[subdomain.split('-')[0].replace("ai", '')] });
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