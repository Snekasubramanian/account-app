import AES from 'crypto-js/aes';
import CryptoJSCore from 'crypto-js/core';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import Pkcs7 from 'crypto-js/pad-pkcs7';
import Rp from 'sha.js';

export default class EncryptionUtils {
  Encryptionkey: string = 'aGgRTenEUgoACtcOAr';
  Decryptionkey: string = 'AecECroRUgnGTa';

  hashstring: string = '';
  hashsubstring: string = '';
  Encrypted: string = '';
  Dencrypted: string = '';
  iv: any = Utf8.parse('globalaesvectors');
  encryption(e: string, t: string) {
    this.hashstring = Rp('sha256').update(this.Encryptionkey).digest('hex');
    this.hashsubstring = this.hashstring.substring(0, 32);
    const n = Utf8.parse(this.hashsubstring);
    if ('Encrypt' == e) {
      var l = AES.encrypt(Utf8.parse(t), n, {
        keySize: 16,
        iv: this.iv,
        mode: CryptoJSCore.mode.CBC,
        padding: Pkcs7,
      });
      return l.ciphertext.toString(Base64).split('+').join('-').split('/').join('_');
    }
    if ('Decrypt' == e) {
      if (null != t) {
        var i = t.split('-').join('+');
        return (
          (i = i.split('_').join('/')),
          AES.decrypt(i, n, {
            keySize: 16,
            iv: this.iv,
            mode: CryptoJSCore.mode.CBC,
            padding: Pkcs7,
          }).toString(Utf8)
        );
      }
      return null;
    }
  }
  Decryption(e: string, t: string) {
    this.hashstring = Rp('sha256').update(this.Decryptionkey).digest('hex');
    this.hashsubstring = this.hashstring.substring(0, 32);
    var n = Utf8.parse(this.hashsubstring);
    if ('Decrypt' == e) {
      var l = t.split('-').join('+');
      l = l.split('_').join('/');
      var i = AES.decrypt(l, n, {
        keySize: 16,
        iv: this.iv,
        mode: CryptoJSCore.mode.CBC,
        padding: Pkcs7,
      });
      return i.toString(Utf8);
    }
  }
  encrypt(payload: string) {
    return this.encryption('Encrypt', payload);
  }

  decrypt(payload: string) {
    return this.Decryption('Decrypt', payload);
  }
}
