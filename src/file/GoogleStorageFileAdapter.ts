import {FileAdapter, ICreateReadStreamOptions, IGetBase64Options, IGetSignedURLOptions} from "./FileAdapter";
import {File as GoogleStorageFile} from "@google-cloud/storage";
import {Readable} from "stream";
import axios from "axios";

type GoogleStorageCreateReadStreamValidation = 'md5' | 'crc32c' | false | true;

interface IGoogleStorageCreateReadStreamOptions extends ICreateReadStreamOptions {
    validation?: GoogleStorageCreateReadStreamValidation;
    start?: number;
    end?: number;
    decompress?: boolean;
}

type GoogleStorageSignedURLAction = 'read' | 'write' | 'delete' | 'resumable';

interface IGoogleStorageGetSignedURLOptions extends IGetSignedURLOptions {
    action: GoogleStorageSignedURLAction;
    expires: number;
    virtualHostedStyle?: boolean;
}

class GoogleStorageFileAdapter extends FileAdapter<GoogleStorageFile> {
    async exists(): Promise<boolean> {
        const [exists] = await this.nativeFile.exists();
        return exists;
    }

    createReadStream(options: IGoogleStorageCreateReadStreamOptions): Readable {
        return this.nativeFile.createReadStream(options);
    }

    async getSignedURL(options: IGoogleStorageGetSignedURLOptions): Promise<string> {
        const [signedURL] = await this.nativeFile.getSignedUrl(options);
        return signedURL;
    }

    async getBase64(): Promise<string> {
        const signedURL = await this.getSignedURL({
            action: "read",
            expires: Date.now() + 604800000,
            virtualHostedStyle: true
        });

        const response = await axios.get(signedURL, {responseType: "arraybuffer"});
        return `data:${this.nativeFile.metadata.contentType};base64,`
            + Buffer.from(response.data, 'binary').toString('base64');
    }

}

export {
    IGoogleStorageCreateReadStreamOptions,
    IGoogleStorageGetSignedURLOptions,
    GoogleStorageFileAdapter
}