'use strict';

const opentelemetry = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

const EXPORTER = process.env.EXPORTER || '';


module.exports = (serviceName) => {
  const provider = new NodeTracerProvider({
    plugins: {
      http: {
        enabled: true,
        path: '@opentelemetry/plugin-http'
      },
    },
  });


    const exporter = new JaegerExporter({
      serviceName,
    });

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
  provider.register();

  return opentelemetry.trace.getTracer('foodcourt-example');
};