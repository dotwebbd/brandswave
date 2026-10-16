// Usage: npm run hash-password -- "your-strong-password"
// Prints a base64-encoded bcrypt hash (base64 avoids "$" expansion problems in .env files).
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password || password.length < 10) {
  console.error('Provide a password of at least 10 characters:\n  npm run hash-password -- "your-strong-password"');
  process.exit(1);
}
const hash = bcrypt.hashSync(password, 12);
console.log("\nAdd this to .env.local (and to your hosting env vars):\n");
console.log(`ADMIN_PASSWORD_HASH_B64="${Buffer.from(hash).toString("base64")}"\n`);
