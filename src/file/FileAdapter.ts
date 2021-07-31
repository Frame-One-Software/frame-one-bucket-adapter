import {Readable} from 'stream';

interface IFileAdapterConstructor<NativeFile> {
    file: NativeFile;
}

interface ICreateReadStreamOptions {

}

interface IGetSignedURLOptions {

}

interface IGetBase64Options {

}

abstract class FileAdapter<NativeFile> {

    protected readonly nativeFile: NativeFile;

    constructor(args: IFileAdapterConstructor<NativeFile>) {
        this.nativeFile = args.file;
    }

    public getNativeFile(): NativeFile {
        return this.nativeFile;
    }

    public abstract exists(): Promise<boolean>;

    public abstract createReadStream(options: ICreateReadStreamOptions): Readable;

    public abstract getSignedURL(options: IGetSignedURLOptions): Promise<string>;

    public abstract getBase64(options: IGetBase64Options): Promise<string>;
}

export {
    IFileAdapterConstructor,
    ICreateReadStreamOptions,
    IGetSignedURLOptions,
    IGetBase64Options,
    FileAdapter
};
