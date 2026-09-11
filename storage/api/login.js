import crypto from "crypto";

const USERNAME = "admin";
const PASSWORD = "storage";

// Secret wajib diganti
const SECRET = process.env.SESSION_SECRET || "ganti-secret-ini";

function createToken(username) {
  const payload = Buffer.from(
    JSON.stringify({
      username,
      exp: Date.now() + 24 * 60 * 60 * 1000
    })
  ).toString("base64url");

  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  const { username, password } = req.body || {};

  if (
    username !== USERNAME ||
    password !== PASSWORD
  ) {
    return res.status(401).json({
      success: false,
      message: "Username atau password salah"
    });
  }

  const token = createToken(username);

  res.setHeader(
    "Set-Cookie",
    `session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`
  );

  return res.status(200).json({
    success: true
  });
}
