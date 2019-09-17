const http = require('http');
const port = process.env.APP_PORT || 3000;

const agent = 'Reselbob Travel';

const services = ['auto', 'lodging', 'airline'];

const sample = (items) => {return items[Math.floor(Math.random()*items.length)];};

const handleRequest = (request, response)  => {

    const service = sample(services);

    http.get(`http://${service}:3000`, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            const obj = JSON.parse(data);
            obj.agent = agent;
            const str = JSON.stringify(obj);
            console.log(JSON.stringify({organization:'demo', data: obj}));
            response.setHeader("Content-Type", "application/json");
            response.writeHead(200);
            response.end(str);
        });

    }).on("error", (error) => {
        const str = JSON.stringify({error, agent });
        console.error(str);
        response.setHeader("Content-Type", "application/json");
        response.writeHead(500);
        response.end(str);
    });
};

const server = http.createServer(handleRequest);

server.listen(port, () => {
    console.log(`${agent} API Server is listening on port ${port}`);
});


const shutdown = (signal) => {
    if(!signal){
        console.log(`${agent} API Server shutting down at ${new Date()}`);
    }else{
        console.log(`Signal ${signal} : ${agent} API Server shutting down at ${new Date()}`);
    }
    server.close(function () {
        process.exit(0);
    })
};
process.on('SIGTERM', function () {
    shutdown('SIGTERM');
});

process.on('SIGINT', function () {
    shutdown('SIGINT');
});

module.exports = {server,shutdown};
