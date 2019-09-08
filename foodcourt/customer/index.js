const http = require('http');
const port = process.env.APP_PORT || 3000;

const customer = 'Friendly Shopper';

const services = ['burgerqueen', 'hobos', 'iowafried'];

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
            obj.customer = customer;
            const str = JSON.stringify(obj);
            response.setHeader("Content-Type", "application/json");
            response.writeHead(200);
            response.end(str);
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
        const str = JSON.stringify(err);
        response.setHeader("Content-Type", "application/json");
        response.writeHead(500);
        response.end(str);
    });
};

const server = http.createServer(handleRequest);
server.listen(port, () => {
    console.log(`${customer} API Server is listening on port ${port}`);
});

const shutdown = () => {
    console.log(`${customer} API Server shutting down at ${new Date()}`);
    server.close();
};

module.exports = {server,shutdown};
