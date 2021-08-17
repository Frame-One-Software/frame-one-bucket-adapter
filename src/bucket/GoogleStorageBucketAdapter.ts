import {
	BucketAdapter,
	IBucketAdapterConstructor,
	ICreateReadStreamOptions,
	IGetSignedURLOptions,
	IUploadOptions
} from "./BucketAdapter";
import {Bucket as GoogleStorageBucket, Storage} from "@google-cloud/storage";
import {Readable} from "stream";
import {CreateReadStreamOptions, GetSignedUrlConfig} from "@google-cloud/storage/build/src/file";
import axios from "axios";

interface IGoogleStorageBucketAdapterConstructor extends IBucketAdapterConstructor {
	storage: Storage;
}

interface IGoogleStorageCreateReadStreamOptions extends ICreateReadStreamOptions {
	validation?: CreateReadStreamOptions["validation"];
}

interface IGoogleStorageGetSignedURLOptions extends IGetSignedURLOptions {
	action: GetSignedUrlConfig["action"];
	virtualHostedStyle?: GetSignedUrlConfig["virtualHostedStyle"];
}

interface IGoogleStorageUploadOptions extends IUploadOptions {
	mimetype: string;
	gzip: boolean;
}

class GoogleStorageBucketAdapter extends BucketAdapter {
	private readonly _googleBucket: GoogleStorageBucket;

	constructor(args: IGoogleStorageBucketAdapterConstructor) {
		super(args);
		this._googleBucket = args.storage.bucket(args.bucketName);
	}

	public get googleBucket() {
		return this._googleBucket
	}

	async createReadStream(name: string, options: IGoogleStorageCreateReadStreamOptions): Promise<Readable> {
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

	async getBase64(name: string): Promise<string> {
		// find the file
		const file = this._googleBucket.file(name);

		// get the signed url
		const [signedURL] = await file.getSignedUrl({
			action: "read",
			expires: 604800000,
			virtualHostedStyle: true
		});

		// create the base 64
		const response = await axios.get(signedURL, {responseType: "arraybuffer"});
		return `data:${file.metadata.contentType};base64,`
			+ Buffer.from(response.data, 'binary').toString('base64');
	}

	async getSignedURL(name: string, options: IGoogleStorageGetSignedURLOptions): Promise<string> {
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

	async upload(filePath: string, options: IGoogleStorageUploadOptions): Promise<void> {
		await this._googleBucket.upload(filePath, options);
	}
}

export {GoogleStorageBucketAdapter}