interface IBucketAdapterConstructor<NativeBucketObject> {
	nativeBucket: NativeBucketObject
}

interface IGetSignedURLArgs {

}


abstract class BucketAdapter<NativeBucketObject> {

	protected readonly nativeBucket: NativeBucketObject;

	constructor(args: IBucketAdapterConstructor<NativeBucketObject>) {
		this.nativeBucket = args.nativeBucket;
	}

	public getNativeBucket(): NativeBucketObject {
		return this.nativeBucket;
	}

	public abstract getSignedURL(args: IGetSignedURLArgs): Promise<string>

}

export {
	IBucketAdapterConstructor,
	IGetSignedURLArgs,
	BucketAdapter
};
