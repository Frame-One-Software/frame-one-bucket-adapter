import {Readable} from "stream";

interface IBucketAdapterConstructor {
    bucketName: string;
}

interface ICreateReadStreamOptions {

}

interface IGetBase64Options {

}

interface IGetSignedURLOptions {
    expires: number;
}

interface IUploadOptions {
    fileName: string;
    contentType: string;
}

abstract class BucketAdapter {

    private readonly _bucketName: string;

    constructor(args: IBucketAdapterConstructor) {
        this._bucketName = args.bucketName;
    }

    public get bucketName(): string {
        return this._bucketName;
    }

    public abstract createReadStream(name: string, options: ICreateReadStreamOptions): Promise<Readable>;

    public abstract exists(name: string): Promise<boolean>;

    public abstract getBase64(name: string, options: IGetBase64Options): Promise<string>;

    public abstract getSignedURL(name: string, options: IGetSignedURLOptions): Promise<string>;

    public abstract upload(filePath: string, options: IUploadOptions): Promise<void>;
    public abstract upload(data: Buffer, options: IUploadOptions): Promise<void>;
}

export {
    IBucketAdapterConstructor,
    ICreateReadStreamOptions,
    IGetBase64Options,
    IGetSignedURLOptions,
    IUploadOptions,
    BucketAdapter
};
