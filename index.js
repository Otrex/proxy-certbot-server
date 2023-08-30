const ProxyServer = require("./src/proxyServer")
const DomainServer = require("./src/domainServer.js")
const Redis = require("./src/helpers")

const DOMAIN_SERVER_PORT = +(process.env.DOMAIN_SERVER_PORT || 3020);
const PROXY_SERVER_PORT = +(process.env.PROXY_SERVER_PORT || 81); //3022

Redis.ConnectToRedis().then(() => {
  ProxyServer.listen(PROXY_SERVER_PORT, () => {
    console.log(`Reverse proxy server listening on port ${PROXY_SERVER_PORT}`);
  });
  DomainServer.listen(DOMAIN_SERVER_PORT, () => {
    console.log(`Domain server listening on port ${DOMAIN_SERVER_PORT}`);
  })
}).catch((err) => {
  console.error(err);
})