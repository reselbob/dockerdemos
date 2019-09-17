const faker = require('faker');
const uuidv4 = require('uuid/v4');
const http = require('http');
const flatted = require('flatted');

const port = process.env.APP_PORT || 3000;
const appName = process.env.APP_NAME || uuidv4();
let appItems = [];

try {
    appItems = process.env.APP_ITEMS.split(":");
} catch (e) {
    const words = faker.random.words(4);
    appItems = words.split(' ');
}

const sample = (items) => {return items[Math.floor(Math.random()*items.length)];};

const shutdown = (signal) => {
    if(!signal){
        console.log(`${appName} API Server shutting down at ${new Date()}`);
    }else{
        console.log(`Signal ${signal} : ${appName} API Server shutting down at ${new Date()}`);
    }
    server.close(() => {
        process.exit(0);
    })
};

const server = http.createServer((request, response) => {
    const item = sample(appItems) ;
    const str = JSON.stringify({appName, item});

    console.log(flatted.stringify({response, appName, item}));

    response.setHeader("Content-Type", "application/json");
    response.writeHead(200);
    response.end(str);
}).listen(port, (err) => {
    console.log(`${appName} API Server is started on ${port}  at ${new Date()} with pid ${process.pid}`);
});

process.on('SIGTERM', function () {
    shutdown('SIGTERM');
});

process.on('SIGINT', function () {
    shutdown('SIGINT');
});
