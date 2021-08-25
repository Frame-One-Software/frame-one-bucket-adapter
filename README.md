[![Frame One Table Logo](./meta/graphic1_blue_whitebg_jpg1x.jpg)](https://github.com/Frame-One-Software/frame-one-bucket-adapter/)
[![NPM](https://img.shields.io/npm/v/frame-one-bucket-adapter.svg)](https://www.npmjs.com/package/frame-one-bucket-adapter)
[![NPM](https://img.shields.io/npm/dt/frame-one-bucket-adapter.svg)](https://www.npmjs.com/package/frame-one-bucket-adapter)
[![GITHUB](https://img.shields.io/github/issues/Frame-One-Software/frame-one-bucket-adapter.svg)](https://github.com/Frame-One-Software/frame-bucket-adapter/issues)

## Installation

### npm
```bash
npm install frame-one-bucket-adapter
```

### yarn
```bash
yarn add frame-one-bucket-adapter
```

## Usage

### S3

```typescript
import S3 from "aws-sdk/clients/s3";
import {S3BucketAdapter} from "frame-one-bucket-adapter";

const s3 = new S3({
    accessKeyId: '/* access key here */', // For example, 'AKIXXXXXXXXXXXGKUY'.
    secretAccessKey: '/* secret key here */', // For example, 'm+XXXXXXXXXXXXXXXXXXXXXXDDIajovY+R0AGR'.
    region: '/* region here */' // For example, 'us-east-1'.
});

const bucket = new S3BucketAdapter({bucketName: '/* bucket name here */', s3});

const fileName = "test-image"

// upload file
await bucket.upload("/* file path or Buffer */", {fileName, contentType: "image/png"});

// check the file exists on the bucket
const exists = await bucket.exists(fileName);
if (!exists) {
    throw new Error("Could not find file.");
}

// create a read stream
const readStream = await bucket.createReadStream(fileName);
```

### Google Storage

```typescript
import {Bucket, Storage} from "@google-cloud/storage";
import {GoogleStorageBucketAdapter} from "frame-one-bucket-adapter";

const storage = new Storage({
    projectId: '/* project id here */',
    credentials: {
        client_email: '/* client email here */',
        private_key: '/* private key here */',
    }
});

const bucket = new GoogleStorageBucketAdapter({bucketName: '/* bucket name here */', storage});

const fileName = "test-image"

// upload file
await bucket.upload("/* file path or Buffer */", {fileName, contentType: "image/png", gzip: true});

// check the file exists on the bucket
const exists = await bucket.exists(fileName);
if (!exists) {
    throw new Error("Could not find file.");
}

// create a read stream
const readStream = await bucket.createReadStream(fileName, {validation: true});
```
