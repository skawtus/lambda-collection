data pipeline collection service
========

__A lambda function that runs in [AWS Lambda](http://aws.amazon.com/lambda/)__

1. triggered by incoming message in [AWS SQS](http://aws.amazon.com/sqs/)
2. Forwards messages to lambda function [dp-augmentation-svc](https://github.com/skawtus/dp-augmentation-svc) for augmentation.
3. Batch deletes handled messages from the queue.

