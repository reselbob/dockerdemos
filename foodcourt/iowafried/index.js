const http = require('http');
const port = process.env.APP_PORT || 3000;

const initTracer = require('./tracer').initTracer;
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing');
const tracer = initTracer('foodcourt_iowafried');

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

    parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, request.headers)
    const span = tracer.startSpan('iowafried_service_request', {
        childOf: parentSpanContext,
        tags: { [Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER }
    });

    const order = sample(foods) ;

    span.setTag('indentified_order', order);
    span.log({
        'event': 'iowafried_service_request',
        'value': order
    });

    const str = JSON.stringify({restaurant, order});

    span.setTag(Tags.HTTP_STATUS_CODE, 200)
    span.setTag('iowafried_call_result', str)

    response.setHeader("Content-Type", "application/json");
    response.writeHead(200);
    response.end(str);

    span.finish();
}).listen(port, (err) => {
    console.log(`${restaurant} API Server is started on ${port}  at ${new Date()} with pid ${process.pid}`);
});

process.on('SIGTERM', function () {
    shutdown('SIGTERM');
});

process.on('SIGINT', function () {
    shutdown('SIGINT');
});
