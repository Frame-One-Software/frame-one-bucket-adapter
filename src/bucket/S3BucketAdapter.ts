import {
    BucketAdapter,
    IBucketAdapterConstructor,
    ICreateReadStreamOptions,
    IGetBase64Options, IGetSignedURLOptions,
    IUploadOptions
} from "./BucketAdapter";
import S3, {PutObjectRequest} from "aws-sdk/clients/s3";
import {Readable} from "stream";
import * as fs from "fs-extra";
import axios from "axios";
import {AWSError} from "aws-sdk";

interface IS3BucketAdapterConstructor extends IBucketAdapterConstructor {
    s3: S3;
}

interface IS3CreateReadStreamOptions extends ICreateReadStreamOptions {

}

interface IS3GetBase64Options extends IGetBase64Options {

}

interface IS3GetSignedURLOptions extends IGetSignedURLOptions {

}

interface IS3UploadOptions extends IUploadOptions {

}

class S3BucketAdapter extends BucketAdapter {
    private readonly _s3: S3;

    constructor(args: IS3BucketAdapterConstructor) {
        super(args);
        this._s3 = args.s3;
    }

    public get s3() {
        return this._s3;
    }

    async createReadStream(name: string, options: ICreateReadStreamOptions): Promise<Readable> {
        // check that the file exists
        const exists = await this.exists(name);
        if (!exists) {
            throw new Error("Could not find the file.");
        }

        const params: S3.Types.GetObjectRequest = {
            Bucket: this.bucketName,
            Key: name
        }

        return this.s3.getObject(params).createReadStream();
    }

    exists(name: string): Promise<boolean> {
        const params: S3.Types.HeadObjectRequest = {
            Bucket: this.bucketName,
            Key: name,
        }

        return new Promise((resolve, reject) => {
            this.s3.headObject(params, (err) => {
                if (err) {
                    if (err.code === 'NotFound') {
                        resolve(false);
                    } else {
                        reject(err.originalError);
                    }
                } else {
                    resolve(true);
                }
            })
        })
    }

    async getBase64(name: string, options: IGetBase64Options): Promise<string> {
        const params: S3.Types.HeadObjectRequest = {
            Bucket: this.bucketName,
            Key: name
        }

        // find the content type
        let headObject;
        try {
            headObject = await new Promise<S3.HeadObjectOutput>((resolve, reject) => {
                this.s3.headObject(params, (err: AWSError, data: S3.HeadObjectOutput) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                })
            });
        } catch (error) {
            console.error("Was not able to get Base 64 of your asset:", error);
            throw new Error(error.originalError);
        }

        const signedURL = await this.getSignedURL(name, {expires: 604800});

        const response = await axios.get(signedURL, {responseType: "arraybuffer"});
        return `data:${headObject.ContentType};base64,`
            + Buffer.from(response.data, 'binary').toString('base64');
    }

    getSignedURL(name: string, options: IGetSignedURLOptions): Promise<string> {
        const params = {
            Bucket: this.bucketName,
            Key: name,
            Expires: options.expires
        }

        return new Promise((resolve, reject) => {
            this.s3.getSignedUrl("getObject", params, (err, url) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(url);
                }
            })
        })
    }

    async upload(filePathOrData: string | Buffer, options: IUploadOptions): Promise<void> {
        // if given filePath read the file
        let data: Buffer;
        if (typeof filePathOrData === "string") {
            data = await fs.readFile(filePathOrData);
        } else {
            data = filePathOrData;
        }

        const params: PutObjectRequest = {
            Bucket: this.bucketName,
            Key: options.fileName,
            Body: data,
        }

        return new Promise((resolve, reject) => {
            this.s3.upload(params, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    }
}

export {S3BucketAdapter}