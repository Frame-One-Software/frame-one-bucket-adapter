import {BucketAdapter} from "../BucketAdapter";
import {Bucket as GoogleBucket} from "@google-cloud/storage";
import {IGetSignedURLArgs} from "../BucketAdapter";

interface IGetSignedURLGoogleStorageBucketArgs extends IGetSignedURLArgs {

}

class GoogleStorageBucketAdapter extends BucketAdapter<GoogleBucket> {
	async getSignedURL(args: IGetSignedURLGoogleStorageBucketArgs): Promise<string> {
		this.nativeBucket
	}
}

export {GoogleStorageBucketAdapter}