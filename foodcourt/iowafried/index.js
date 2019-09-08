const http = require('http');
const port = process.env.APP_PORT || 3000;

const restaurant = 'Iowa Fried Chicken';

const foods = ['Chix Pack', '20 Piece Bucket', 'Chicken Pot Pir', 'Spicy Wings']

const sample = (items) => {return items[Math.floor(Math.random()*items.length)];};

const handleRequest = (request, response)  => {
    const order = sample(foods) ;
    const str = JSON.stringify({restaurant, order});
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