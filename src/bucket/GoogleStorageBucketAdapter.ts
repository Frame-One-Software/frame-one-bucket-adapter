import {BucketAdapter, IFileOptions, IUploadOptions} from "./BucketAdapter";
import {Bucket as GoogleStorageBucket, File as GoogleStorageFile} from "@google-cloud/storage";
import {GoogleStorageFileAdapter} from "../file/GoogleStorageFileAdapter";
import {FileAdapter} from "../file/FileAdapter";

interface IGoogleStorageFileOptions extends IFileOptions {

}

interface IGoogleStorageUploadOptions extends IUploadOptions {

}

class GoogleStorageBucketAdapter extends BucketAdapter<GoogleStorageBucket, GoogleStorageFile> {
	async file(name: string, options: IFileOptions): Promise<FileAdapter<GoogleStorageFile>> {
		const file = await this.nativeBucket.file(name);
		return new GoogleStorageFileAdapter({file});
	}

	async upload(filePath: string, options: IUploadOptions): Promise<void> {
		await this.nativeBucket.upload(filePath, options);
	}
}

export {GoogleStorageBucketAdapter}