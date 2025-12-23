# 🛰️ OpenTelemetry and Distributed Tracing

This project uses **OpenTelemetry** with the **AWS Distro for OpenTelemetry
(ADOT)** to enable distributed tracing and monitoring. This guide explains how
the setup works.

## 📝 Overview

OpenTelemetry is an open-source observability framework for instrumenting,
generating, collecting, and exporting telemetry data (traces, metrics, logs). In
this project, we use it to trace requests as they flow through our different
microservices, which is essential for debugging and performance monitoring in a
distributed system.

All OpenTelemetry configuration is centralized in the `serverless/common.yaml`
file to ensure consistency across all services.

## 🚀 AWS Distro for OpenTelemetry (ADOT)

We use the **AWS Distro for OpenTelemetry (ADOT)**, which is a secure,
production-ready, AWS-supported distribution of the OpenTelemetry project.

### ADOT Lambda Layer

The ADOT Lambda layer is included in all functions via the `layers` property in
`serverless/common.yaml`:

```yaml
provider:
  layers:
    - arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-30-1:1
```

This layer bundles the OpenTelemetry SDKs, the ADOT collector, and all the
necessary components to automatically instrument our code.

### Execution Wrapper

To automatically initialize and manage the OpenTelemetry SDK, we use the ADOT
Lambda wrapper. This is configured via an environment variable:

```yaml
provider:
  environment:
    AWS_LAMBDA_EXEC_WRAPPER: /opt/otel-handler
```

This tells the Lambda service to invoke our function handler through the
`/opt/otel-handler` script provided by the ADOT layer. This wrapper takes care
of starting and finishing traces for each Lambda invocation.

## ⚙️ Environment Variable Configuration

The behavior of the OpenTelemetry SDK is controlled by several environment
variables set in `serverless/common.yaml`:

| Variable                             | Value                                 | Description                                                                                                                                                         |
| ------------------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OTEL_SERVICE_NAME`                  | `${self:service}`                     | Sets the service name for each microservice (e.g., `books-service`). This is crucial for identifying services in trace visualizations like AWS X-Ray.               |
| `OTEL_TRACES_SAMPLER`                | `always_on`                           | Configures the sampler to capture **all** traces. For production, you might change this to a rate-based sampler (e.g., `parentbased_traceidratio_1.0`).             |
| `OTEL_PROPAGATORS`                   | `xray,tracecontext,baggage`           | Specifies the context propagation formats. This allows trace context to be passed between services, even if they use different OpenTelemetry implementations.       |
| `OTEL_NODE_ENABLED_INSTRUMENTATIONS` | `aws-lambda,aws-sdk,http,https,fetch` | **Optimization**: This is a key setting for reducing cold start times. It tells OpenTelemetry to only instrument specific libraries, avoiding unnecessary overhead. |
| `OPENTELEMETRY_EXTENSION_LOG_LEVEL`  | `error`                               | Reduces the log output from the OpenTelemetry extension itself, keeping our CloudWatch Logs cleaner.                                                                |

## 🤝 Integration with AWS X-Ray

The ADOT configuration in this project is set up to automatically export traces
to **AWS X-Ray**. This is achieved through:

1. **`tracing: lambda: true`**: This provider-level setting enables active
   tracing on the Lambda function, which integrates with X-Ray.
2. **`OTEL_PROPAGATORS: xray`**: The `xray` propagator ensures that the trace
   context is compatible with AWS X-Ray's format (`X-Amzn-Trace-Id` header).

When you deploy a service, you can navigate to the **AWS X-Ray** console to view
the service map and analyze traces for your requests.

## 📚 See Also

- [AWS Distro for OpenTelemetry (ADOT) Documentation](https://aws-otel.github.io/)
- [OpenTelemetry Specification](https://opentelemetry.io/docs/specs/otel/)
- [Serverless Framework - Layers](https://www.serverless.com/framework/docs/providers/aws/guide/layers)
