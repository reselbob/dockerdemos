const http = require('http');
const port = process.env.APP_PORT || 3000;
const request = require('request-promise');

const initTracer = require('./tracer').initTracer;
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing');
const service = 'hobos';
const tracer = initTracer(service);

const restaurant = 'Howard Bonsons';

const foods = ['fried shrimp', 'grilled cheese', 'double burger', 'soda and fries']

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

const callPaymentService = async (payload, root_span) => {
    const span = tracer.startSpan('call_service', { childOf: root_span.context() });
    span.setTag(Tags.SPAN_KIND, Tags.SPAN_KIND_RPC_CLIENT);
    const headers = {};
    tracer.inject(span.context(), FORMAT_HTTP_HEADERS, headers);
    span.log({
        'event':'call_service_header',
        'value':JSON.stringify( headers)
    });

    const method = 'GET';
    const service = 'payments';
    const url = `http://${service}:${port}`;
    return request({ url, method, headers })
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
};

const handleRequest = async(request, response) => {
    parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, request.headers)
    const span = tracer.startSpan('restaurant_service_request', {
        childOf: parentSpanContext,
        tags: { [Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER,  'business_group': 'restaurant'}
    });

    
    span.log({
        'event': 'request_headers',
        'value': request.headers
    });
    const order = sample(foods) ;
    const purchase = { service, item: order, amount: 0 };
    const data = await callPaymentService(purchase, span);

    span.setTag('identified_order', order);
    span.log({
        'event': 'hobos_service_request',
        'value': order
    });
    const str = JSON.stringify({restaurant, order});

    span.setTag(Tags.HTTP_STATUS_CODE, 200)
    span.setTag('hobos_call_result', str)

    response.setHeader("Content-Type", "application/json");
    response.writeHead(200);
    response.end(str);

    span.finish();
}

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

module.exports = { server, shutdown };

