[![Build Status](https://travis-ci.org/secretagentsnowman/snowpull.svg)](https://travis-ci.org/secretagentsnowman/snowpull)

snowpull
========

__A lambda function meant to run in [AWS Lambda](http://aws.amazon.com/lambda/), triggered by incoming [snowball](https://github.com/secretagentsnowman/snowball)__

![Snowpull](snowpull.jpg)

-  Pulls messages from  [Amazon Simple Queue Service (SQS)](http://aws.amazon.com/sqs/)
-  Handles the messages (chain of responsibility & decorator pattern) sequentially.
- Deletes the handled messages from the queue.

