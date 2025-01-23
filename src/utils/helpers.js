const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.SECRET_KEY || "gizli-anahtar",
    { expiresIn: "24h" }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY || "gizli-anahtar");
  } catch (error) {
    throw new Error("Geçersiz token");
  }
};

const sanitizeUser = (user) => {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };
};

module.exports = {
  generateToken,
  verifyToken,
  sanitizeUser,
};
