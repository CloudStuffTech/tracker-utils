let crypto = require('crypto');
let shortid = require('shortid');
const isIp = require('is-ip');

/**
 * @package Cloudstuff Tracker Utils
 * @module Security
 * @version 1.0
 * @author Hemant Mann <hemant.mann@vnative.com>
 */
class Security {
  constructor() {}

  /**
   * Generate a unique random id of length 7-14 characters
   * @return {String} URL friendly ID
   */
  id() {
    return shortid.generate();
  }

  /**
   * Generate an MD5 Hash of the given string
   * @param  {String} str String to be hashed
   * @return {String}
   */
  md5(str) {
    return crypto.createHash('md5').update(str).digest("hex");
  }

  /**
   * Remove the last octet from the IP Address for privacy reasons
   * @param  {String} ipaddr IPV4 or IPV6 compliant IP Address
   * @return {String}        Modified IP
   */
  maskIp(ipaddr) {
    if (isIp(ipaddr)) {
      if (isIp.v4(ipaddr)) {
        let parts = ipaddr.split(".");
        parts[parts.length - 1] = "0";

        ipaddr = parts.join('.');
      } else if (isIp.v6(ipaddr)) {
        let parts = ipaddr.split(":");
        parts[parts.length - 1] = "0000";

        ipaddr = parts.join(':');
      }
    }
    return ipaddr;
  }

  encrypt (text, key) {
    const passwordHash = crypto.createHash('sha256').update(key).digest("hex").substr(0, 32);
    const iv = Buffer.from(crypto.randomBytes(16)).toString("hex").slice(0, 16);
    const cipher = crypto.createCipheriv("AES-256-CBC", passwordHash, iv);
    const cipherText = cipher.update(text, "utf8", "base64") + cipher.final("base64");
    const encodedIv = Buffer.from(iv).toString('base64');
    const hmac = crypto.createHmac("sha256",cipherText);
    const hashHmac = hmac.update(Buffer.from(passwordHash, 'utf-8')).digest();
    const encodedHmac = Buffer.from(hashHmac).toString('base64').substr(0,44);
    return encodedIv+encodedHmac+cipherText;
  }

  decrypt (text, key) {
    const passwordHash = crypto.createHash('sha256').update(key).digest("hex").substr(0, 32);
    const decodedIv = text.substring(24,0);
    const iv = Buffer.from(decodedIv,'base64'); 
    const decipherText = text.slice(68);
    const decipher = crypto.createDecipheriv("AES-256-CBC", passwordHash, iv);
    const originalText = decipher.update(decipherText, "base64", "utf8") + decipher.final("utf8");
    return originalText;
  }
}

module.exports = new Security;