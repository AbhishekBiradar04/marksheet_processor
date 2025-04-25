const crypto = require('crypto');
const JWT_SECRET = crypto.randomBytes(64).toString('hex');
console.log(JWT_SECRET);