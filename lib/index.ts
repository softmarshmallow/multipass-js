// import * as crypto from "crypto-js";
// const crypto = require('crypto');
import * as crypto from "crypto"

const BLOCK_SIZE = 16;


// extend this interface the way your database holds
interface IMultipassCustomerData{
    email: string
    username?: string
    data: any
}

class Multipass{
    secret: string
    _encryptionKey: Buffer
    _signingKey: Buffer

    customer: any
    domain: string
    redirect?: string

    constructor(secret){
        if (!(typeof secret == 'string' && secret.length > 0)) throw new Error('Invalid Secret');
        
        this.secret = secret

        // Use the Multipass secret to derive two cryptographic keys,
        // one for encryption, one for signing
        var hash = crypto.createHash("sha256").update(secret).digest();
        this._encryptionKey = hash.slice(0, BLOCK_SIZE);
        this._signingKey = hash.slice(BLOCK_SIZE, 32);
    }

    withCustomerData(customer: IMultipassCustomerData | any): Multipass {
        if (!customer){
            throw new Error("customer data you provided is empty or invalid");
        }
        this.customer = customer;
        return this;
    }

    withDomain(domain: string): Multipass{
        // todo add domain validation. check if domain contains http://, if so, normalize it
        this.domain = domain;
        return this;
    }

    withRedirect(to: string): Multipass{
        this.redirect = to;
        return this;
    }
    
    url() {
        if(!this.domain){
            throw new Error("cannot generate url. you did not provided any domain information")
        }
        return "https://" + this.domain + "/account/login/multipass/" + this.encode(this.customer);
    };

    private encode(obj){
        if (!obj) return;

        // Store the current time in ISO8601 format.
        // The token will only be valid for a small timeframe around this timestamp.
        obj["created_at"] = new Date().toISOString();
        if(this.redirect){
            obj["return_to"] = this.redirect;
        }
    
        // Serialize the customer data to JSON and encrypt it
        const cipherText = this.encrypt(JSON.stringify(obj));
    
        // Create a signature (message authentication code) of the ciphertext
        // and encode everything using URL-safe Base64 (RFC 4648)
        let token = Buffer.concat([cipherText, this.sign(cipherText)]).toString('base64');
        token = token.replace(/\+/g, '-') // Replace + with -
            .replace(/\//g, '_'); // Replace / with _
    
        return token;
    }


    private encrypt (plaintext) {
        // Use a random IV
        const iv = crypto.randomBytes(BLOCK_SIZE);
        const cipher = crypto.createCipheriv('aes-128-cbc', this._encryptionKey, iv);

        // Use IV as first block of ciphertext
        const encrypted = Buffer.concat([iv, cipher.update(plaintext, 'utf8'), cipher.final()]);
        return encrypted;
    }

    private sign (data) {
        const signed = crypto.createHmac("SHA256", this._signingKey).update(data).digest();
        return signed;
    }
}




export{
    Multipass,
    IMultipassCustomerData
} 