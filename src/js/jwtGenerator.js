import crypto from 'crypto';
import base64url from 'base64url';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const jwtGenerator = (payload) => {
  const signFunction = crypto.createSign('RSA-SHA256');
  const head = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const jsonHead = JSON.stringify(head);
  const jsonPayload = JSON.stringify(payload);

  const base64urlHead = base64url.encode(jsonHead);
  const base64urlPayload = base64url.encode(jsonPayload);

  signFunction.write(base64urlHead + '.' + base64urlPayload);
  signFunction.end();

  const PRI_KEY = fs.readFileSync(
    __dirname + '/crypto/privateKey.pem',
    'utf-8'
  );

  const signature = base64url.encode(signFunction.sign(PRI_KEY, 'base64'));

  const hash = base64urlHead + '.' + base64urlPayload + '.' + signature;
  console.log(hash);

  return hash;
};

export default jwtGenerator;
