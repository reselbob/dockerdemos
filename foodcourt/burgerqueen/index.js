const http = require('http');
const port = process.env.APP_PORT || 3000;
const { initTracer } = require('./tracer');
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing');
const tracer = initTracer("foodcourt-burgerqueen");

const restaurant = 'Burger Queen';

const foods = ['burger', 'fries', 'whooper', 'onion rings']

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
    const parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, request.headers)
    const span = tracer.startSpan('http_server', {
        childOf: parentSpanContext,
        tags: {[Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER}
    });
    const order = sample(foods) ;
    const str = JSON.stringify({restaurant, order});

    span.log({
        'event': 'get_product',
        'value': str
    });

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


module.exports = {server,shutdown};
