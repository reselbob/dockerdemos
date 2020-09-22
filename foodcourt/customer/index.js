
const http = require('http');
const request = require('request-promise');
const port = process.env.APP_PORT || 3000;

const initTracer = require('./tracer').initTracer;
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing');
const tracer = initTracer('customer');

const customer = 'Friendly Shopper';

const DEFAULT_SERVICES = ['burgerqueen', 'hobos', 'iowafried'];
let services = DEFAULT_SERVICES;

const sample = (items) => { return items[Math.floor(Math.random() * items.length)]; };

const handleRequest = async (request, response) => {
    parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, request.headers)
    const span = tracer.startSpan('customer_service_get', {
        childOf: parentSpanContext,
        tags: { [Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER }
    });

    const service = sample(services);
    span.setTag('indentified_service', service);
    span.log({
        'event': 'customer_service_get',
        'value': service
    });

    const data = await callService(service, span);
    const obj = JSON.parse(data);
    obj.customer = customer;
    const str = JSON.stringify(obj);
    span.setTag(Tags.HTTP_STATUS_CODE, 200)
    span.setTag('service_call_result', str)
    response.setHeader("Content-Type", "application/json");
    response.writeHead(200);
    response.end(str);

    span.finish();
};

const callService = async (service, root_span) => {
    const method = 'GET';
    const headers = {};
    const url = `http://${service}:${port}`;
    const span = tracer.startSpan('call_service', { childOf: root_span.context() });
    tracer.inject(span, FORMAT_HTTP_HEADERS, headers);
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

const server = http.createServer(handleRequest);

server.listen(port, () => {
    console.log(`${customer} API Server is listening on port ${port}`);
});


const shutdown = (signal) => {
    const span = tracer.startSpan('customer_service-shutdown');
    if (!signal) {
        const str = `${customer} API Server shutting down at ${new Date()}`
        span.log({
            'event': 'customer_service_shutdown',
            'value': str
        });
        console.log(str);

    } else {
        const str = `Signal ${signal} : ${customer} API Server shutting down at ${new Date()}`
        span.log({
            'event': 'customer_service_shutdown',
            'value': str
        });
        console.log(str);
    }
    span.finish();
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

module.exports = { server, shutdown };