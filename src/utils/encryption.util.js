import crypto from "node:crypto";

const secreteKey = Buffer.from(process.env.SECRET_KEY); // 32 bytes key for AES-256
const iv_Length = +process.env.IV_LENGTH; // 16 bytes IV for AES
export const encrypt = (text) => {
  const iv = crypto.randomBytes(iv_Length);
  const cipher = crypto.createCipheriv("aes-256-cbc", secreteKey, iv);
  let encryptedDate = cipher.update(text, "utf-8", "hex");
  encryptedDate += cipher.final("hex");
  return `${iv.toString("hex")}:${encryptedDate}`;
};


export const decrypt = ((encryptedDate)=>{
const [iv , encryptedText] = encryptedDate.split(":");
const ivBuffer = Buffer.from(iv, "hex");
const decrypted = crypto.createDecipheriv("aes-256-cbc", secreteKey, ivBuffer);
let decryptedData = decrypted.update(encryptedText, "hex", "utf-8");
decryptedData += decrypted.final("utf-8");
return decryptedData
})

