const http = require('http');
const port = process.env.APP_PORT || 4002;


const foods = ['fried shrimp', 'grilled cheese', 'double burger', 'soda and fries']

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
    console.log(`H API Server is listening on port ${port}`);
});

const shutdown = () => {
    console.log(`BurgerQueen API Server shutting down at ${new Date()}`);
    server.close();
};

module.exports = {server,shutdown};
