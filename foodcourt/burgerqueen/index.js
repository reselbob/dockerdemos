const http = require('http');
const axios = require('axios');
const port = process.env.APP_PORT || 3000;

const service = 'burgerqueen';

const initTracer = require('./tracer').initTracer;
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing');
const tracer = initTracer(service);

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

const handleRequest = async (request, response) => {

    parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, request.headers)
    const span = tracer.startSpan('burgerqueen_service_request', {
        childOf: parentSpanContext,
        tags: { [Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER }
    });

    const order = sample(foods);
    const purchase = {service, item: order, amount: 0};
    const data = await callPaymentService(purchase, span);
    
    span.setTag('indentified_order', order);
    span.log({
        'event': 'burgerqueen_service_request',
        'value': order
    });

    const obj = {restaurant, order, transactionId: data.transactionId, status: data.status}
    const str = JSON.stringify(obj)

    span.setTag(Tags.HTTP_STATUS_CODE, 200)
    span.setTag('burgerqueen_call_result', str)

    response.setHeader("Content-Type", "application/json");
    response.writeHead(200);
    response.end(str);

    span.finish()
}

const callPaymentService = async (payload, root_span) => {
    const service = 'payments';
    const headers = {};
    const url = `http://${service}:${port}`;
    const span = tracer.startSpan('call_service', { childOf: root_span.context() });
    tracer.inject(span, FORMAT_HTTP_HEADERS, headers);
    const res = await axios.post(url, payload)
        .then(data => {
            span.setTag(Tags.HTTP_STATUS_CODE, 200)
            span.setTag('service_call_result', data)
            span.finish();
            return data;
        }, e => {
            span.setTag(Tags.ERROR, true)
            span.log({
                'event': 'error',
                'error.object': e
            });
            span.finish();
        });

    return res;
};

const server = http.createServer(handleRequest);

server.listen(port, (err) => {
    console.log(`${restaurant} API Server is started on ${port}  at ${new Date()} with pid ${process.pid}`);
});

process.on('SIGTERM', function () {
    shutdown('SIGTERM');
});

process.on('SIGINT', function () {
    shutdown('SIGINT');
});


module.exports = {server, shutdown};
