import {FileAdapter} from "../file/FileAdapter";

interface IBucketAdapterConstructor<NativeBucket> {
    nativeBucket: NativeBucket;
}

interface IUploadOptions {

}

interface IFileOptions {

}

abstract class BucketAdapter<NativeBucket, NativeFile> {

    protected readonly nativeBucket: NativeBucket;

    constructor(args: IBucketAdapterConstructor<NativeBucket>) {
        this.nativeBucket = args.nativeBucket;
    }

    public getNativeBucket(): NativeBucket {
        return this.nativeBucket;
    }

    public abstract upload(filePath: string, options: IUploadOptions): Promise<void>;

    public abstract file(name: string, options: IFileOptions): Promise<FileAdapter<NativeFile>>;
}

export {
    IBucketAdapterConstructor,
    IUploadOptions,
    IFileOptions,
    BucketAdapter
};
