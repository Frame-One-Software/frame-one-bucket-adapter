import {Readable} from "stream";

interface BucketAdapterConstructor {
    bucketName: string;
}

interface CreateReadStreamOptions {

}

interface GetBase64Options {

}

interface GetSignedURLOptions {
    expires: number;
}

interface UploadOptions {
    fileName: string;
    contentType: string;
}

abstract class BucketAdapter {

    private readonly _bucketName: string;

    constructor(args: BucketAdapterConstructor) {
        this._bucketName = args.bucketName;
    }

    public get bucketName(): string {
        return this._bucketName;
    }

    public abstract createReadStream(name: string, options?: CreateReadStreamOptions): Promise<Readable>;

    public abstract exists(name: string): Promise<boolean>;

    public abstract getBase64(name: string, options?: GetBase64Options): Promise<string>;

    public abstract getSignedURL(name: string, options: GetSignedURLOptions): Promise<string>;

    public abstract upload(filePath: string, options: UploadOptions): Promise<void>;
    public abstract upload(data: Buffer, options: UploadOptions): Promise<void>;
}

export {
    BucketAdapterConstructor,
    CreateReadStreamOptions,
    GetBase64Options,
    GetSignedURLOptions,
    UploadOptions,
    BucketAdapter
};
