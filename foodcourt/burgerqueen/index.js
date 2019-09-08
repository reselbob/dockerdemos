const http = require('http');
const port = process.env.APP_PORT || 4001;

const restaurant = 'Burger Queen';

const foods = ['burger', 'fries', 'whooper', 'onion rings']

const sample = (items) => {return items[Math.floor(Math.random()*items.length)];};

const handleRequest = (request, response)  => {
    const order = sample(foods) ;
    const str = JSON.stringify({order});
    response.setHeader("Content-Type", "application/json");
    response.writeHead(200);
    response.end(str);
};

const server = http.createServer(handleRequest);
server.listen(port, () => {
    console.log(`${restaurant} API Server is listening on port ${port}`);
});

const shutdown = () => {
    console.log(`${restaurant} API Server shutting down at ${new Date()}`);
    server.close();
};

module.exports = {server,shutdown};
