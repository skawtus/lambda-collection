[![Build Status](https://travis-ci.org/secretagentsnowman/snowpull.svg)](https://travis-ci.org/secretagentsnowman/snowpull)

snowpull
========

__A lambda function meant to run in [AWS Lambda](http://aws.amazon.com/lambda/), triggered by incoming [snowball](https://github.com/secretagentsnowman/snowball)__

![Snowpull](snowpull.jpg)

- Pulls messages from  [Amazon Simple Queue Service (SQS)](http://aws.amazon.com/sqs/)
- Sends found messages to another lambda function, [snowpack](https://github.com/secretagentsnowman/snowpack) for augmentation..
- Batch deletes the handled messages from the queue.

