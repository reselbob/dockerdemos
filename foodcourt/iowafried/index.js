const http = require('http');
const port = process.env.APP_PORT || 3000;

const restaurant = 'Iowa Fried Chicken';

const foods = ['Chix Pack', '20 Piece Bucket', 'Chicken Pot Pie', 'Spicy Wings'];

const sample = (items) => {return items[Math.floor(Math.random()*items.length)];};

const shutdown = (signal) => {
    if(!signal){
        console.log(`${restaurant} API Server shutting down at ${new Date()}`);
    }else{
        console.log(`Signal ${signal} : ${restaurant} API Server shutting down at ${new Date()}`);
    }
    server.close(function () {
        process.exit(0);
    })
};

const server = http.createServer((request, response) => {
    const order = sample(foods) ;
    const str = JSON.stringify({restaurant, order});
    response.setHeader("Content-Type", "application/json");
    response.writeHead(200);
    response.end(str);
}).listen(port, (err) => {
    console.log(`${restaurant} API Server is started on ${port}  at ${new Date()} with pid ${process.pid}`);
});

process.on('SIGTERM', function () {
    shutdown('SIGTERM');
});

process.on('SIGINT', function () {
    shutdown('SIGINT');
});
