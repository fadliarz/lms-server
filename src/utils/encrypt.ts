import CryptoJS from "crypto-js";

const sha256Encrypt = (text: string) => {
  return CryptoJS.SHA3(text).toString();
};

export default sha256Encrypt;
