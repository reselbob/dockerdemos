const http = require('http');
const port = process.env.APP_PORT || 3000;
const { v4: uuidv4 } = require('uuid');

const service = 'payments';

const initTracer = require('./tracer').initTracer;
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing');
const tracer = initTracer(service);


const sample = (items) => {return items[Math.floor(Math.random()*items.length)];};

const shutdown = (signal) => {
    if(!signal){
        console.log(`${service} API Server shutting down at ${new Date()}`);
    }else{
        console.log(`Signal ${signal} : ${service} API Server shutting down at ${new Date()}`);
    }
    server.close(function () {
        process.exit(0);
    })
};

const server = http.createServer((request, response) => {
    parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, request.headers)
    const span = tracer.startSpan('payments_service_request', {
        childOf: parentSpanContext,
        tags: { [Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER }
    });

    span.log({
        'event': 'request_headers',
        'value': request.headers
    });

    let body = '';
    if (request.method.toUpperCase() === 'POST') {

        request.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        request.on('end', () => {
           const payment = JSON.parse(body);
           payment .status = 'PAID';
           payment.transactionId = uuidv4();

            span.setTag('payment', payment);
            span.log({
                'event': 'payment_service_request',
                'value': payment
            });

            const str = JSON.stringify(payment);

            span.setTag(Tags.HTTP_STATUS_CODE, 200)
            span.setTag('payment_call_result', str)

            response.setHeader("Content-Type", "application/json");
            response.writeHead(200);
            response.end(str);

            span.finish();
        });
    }
}).listen(port, (err) => {
    console.log(`${service} API Server is started on ${port}  at ${new Date()} with pid ${process.pid}`);
});

process.on('SIGTERM', function () {
    shutdown('SIGTERM');
});

process.on('SIGINT', function () {
    shutdown('SIGINT');
});

module.exports = { server, shutdown };