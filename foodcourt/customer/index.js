const http = require('http');
const { initTracer } = require("./tracing");
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing');
const tracer = initTracer("foodcourt-customer");

const port = process.env.APP_PORT || 3000;


const customer = 'Friendly Shopper';

const DEFAULT_SERVICES = ['burgerqueen', 'hobos', 'iowafried'];
let services = DEFAULT_SERVICES;

const sample = (items) => {return items[Math.floor(Math.random()*items.length)];};

const handleRequest = (request, response)  => {
    const parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, request.headers)
    const span = tracer.startSpan('http_server', {
        childOf: parentSpanContext,
        tags: {[Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER}
    });

    const service = sample(services);

    span.log({
        'event': 'call_service',
        'value': service
    });

    http.get(`http://${service}:${port}`, (resp) => {
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
    span.finish();
};

const server = http.createServer(handleRequest);

server.listen(port, () => {
    console.log(`${customer} API Server is listening on port ${port}`);
});


const shutdown = (signal) => {
    if(!signal){
        console.log(`${customer} API Server shutting down at ${new Date()}`);
    }else{
        console.log(`Signal ${signal} : ${customer} API Server shutting down at ${new Date()}`);
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
