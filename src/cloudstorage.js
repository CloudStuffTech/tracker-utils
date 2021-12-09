// External and built-in deps
const { Storage } = require('@google-cloud/storage');

/**
 * Note: Environment should have GOOGLE_APPLICATION_CREDENTIALS set up. This has the path of service 
 * account key (.json) file. Required for authentication.
 * @alias Misc/CloudStorage
 * @author Arpit Jain <arpit@trackier.com>
 * @author Abhay Chauhan (@code-dagger)
 */
class CloudStorage {

    /**
     * @constructor
     * @param {string} bucketName - Name of the bucket
     * @param {string} type - Allowed values gbucket, s3bucket
     * @param {string} baseUrl -  string baseurl
     */
    constructor(bucketName, type, baseUrl) {
        this.bucketName = bucketName;
        this.type = type;
        this.baseUrl = baseUrl;
        // TODO: Update this in future when aws will be used.
        this.storage = new Storage();
    }

    /**
     * [PUBLIC] Returns BaseUrl
     * @returns {string}
     */
    getBaseUrl() {
        return this.baseUrl;
    }

    /**
     * [PUBLIC] Returns .Storage
     * @returns {string}
     */
    getStorage() {
        // TODO: Update this in future when aws will be used.
        return this.storage;
    }

    /**
     * [PUBLIC] This method will upload the file to the destination path in the bucket.
     * @param {string} localFilePath - path of local file to upload
     * @param {string} destFileName - destination file path
     * @param {object} options - upload options
     * @returns {Promise}
     * @author Arpit Jain <arpit@trackier.com>
     */
    async uploadFile(localFilePath, destFileName, options = {}) {
        // TODO: Update this in future when aws will be used.
        await this.storage.bucket(this.bucketName).upload(localFilePath, { destination: destFileName, ...options });
    }

    /**
     * [PUBLIC] Delete file from bucket
     * @param {string} fileName - path of file on the bucket
     * @returns {Promise}
     * @author Arpit Jain <arpit@trackier.com>
     */
    async deleteFile(fileName) {
        // TODO: Update this in future when aws will be used.
        await this.storage.bucket(this.bucketName).file(fileName).delete();
    }
}

module.exports = CloudStorage;
