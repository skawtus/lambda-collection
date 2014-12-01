[![Build Status](https://travis-ci.org/secretagentsnowman/snowpull.svg)](https://travis-ci.org/secretagentsnowman/snowpull)

snowpull
========

__pulls, and sorts, and stores incoming 'snowball' messages (a SQS queue).__

![Snowpull](snowpull.jpg)

-  Pulls messages from  [Amazon Simple Queue Service (SQS)](http://aws.amazon.com/sqs/)
-  Validates incoming messages correspond to a valid Group in using [Amazon Identity and Access Management (IAM)](http://aws.amazon.com/iam/).
-  Stores valid messages in [Amazon Simple Storage Service (SQS)](http://aws.amazon.com/s3/)
