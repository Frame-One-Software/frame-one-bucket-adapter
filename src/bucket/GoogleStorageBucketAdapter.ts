import {
	BucketAdapter,
	BucketAdapterConstructor,
	CreateReadStreamOptions, GetBase64Options,
	GetSignedURLOptions,
	UploadOptions
} from "./BucketAdapter";
import {Bucket as GoogleStorageBucket, Storage} from "@google-cloud/storage";
import {Readable} from "stream";
import {CreateReadStreamOptions as NativeCreateReadStreamOptions, GetSignedUrlConfig} from "@google-cloud/storage/build/src/file";
import axios from "axios";

interface GoogleStorageBucketAdapterConstructor extends BucketAdapterConstructor {
	storage: Storage;
}

interface GoogleStorageCreateReadStreamOptions extends CreateReadStreamOptions {
	validation?: NativeCreateReadStreamOptions["validation"];
}

interface GoogleStorageGetBase64Options extends GetBase64Options {

}

interface GoogleStorageGetSignedURLOptions extends GetSignedURLOptions {
	action: GetSignedUrlConfig["action"];
	virtualHostedStyle?: GetSignedUrlConfig["virtualHostedStyle"];
}

interface GoogleStorageUploadOptions extends UploadOptions {
	gzip: boolean;
}

class GoogleStorageBucketAdapter extends BucketAdapter {
	private readonly _googleBucket: GoogleStorageBucket;

	constructor(args: GoogleStorageBucketAdapterConstructor) {
		super(args);
		this._googleBucket = args.storage.bucket(args.bucketName);
	}

	public get googleBucket() {
		return this._googleBucket
	}

	async createReadStream(name: string, options: GoogleStorageCreateReadStreamOptions): Promise<Readable> {
		// find the file
		const file = this._googleBucket.file(name);

		// check if the file exists
		const [exists] = await file.exists();
		if (!exists) {
			throw new Error("Could not find the file.")
		}

		return file.createReadStream({
			validation: options.validation
		});
	}

	async exists(name: string): Promise<boolean> {
		// find the file
		const file = this._googleBucket.file(name);

		// check if the file exists
		const [exists] = await file.exists();
		return exists;
	}

	async getBase64(name: string, options: GoogleStorageGetBase64Options): Promise<string> {
		// find the file
		const file = this._googleBucket.file(name);

		// get the signed url
		const [signedURL] = await file.getSignedUrl({
			action: "read",
			expires: Date.now() + options.expires,
			virtualHostedStyle: true
		});

		// create the base 64
		const response = await axios.get(signedURL, {responseType: "arraybuffer"});
		return `data:${file.metadata.contentType};base64,`
			+ Buffer.from(response.data, 'binary').toString('base64');
	}

	async getSignedURL(name: string, options: GoogleStorageGetSignedURLOptions): Promise<string> {
		// find the file
		const file = this._googleBucket.file(name);

		// get the signed url
		const [signedURL] = await file.getSignedUrl({
			action: options.action,
			expires: Date.now() + options.expires,
			virtualHostedStyle: options.virtualHostedStyle
		});

		return signedURL;
	}

	async upload(filePathOrBuffer: string | Buffer, options: GoogleStorageUploadOptions): Promise<void> {
		// given filePath
		if (typeof filePathOrBuffer === "string") {
			const uploadOptions = {
				destination: options.fileName,
				contentType: options.contentType,
				gzip: options.gzip
			}

			await this._googleBucket.upload(filePathOrBuffer, uploadOptions);
		} else {
			const uploadOptions = {
				contentType: options.contentType,
				gzip: options.gzip
			}

			await this._googleBucket
			    .file(options.fileName)
			    .save(filePathOrBuffer, uploadOptions);
		}
	}
}

export {GoogleStorageBucketAdapter}