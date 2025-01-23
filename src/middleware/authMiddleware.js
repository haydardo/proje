const { validateUser, validateLogin } = require("../utils/validation");
const { verifyToken } = require("../utils/helpers");

// Token doğrulama middleware'i
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token bulunamadı" });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
};

// Kullanıcı validasyon middleware'i
const validateUserMiddleware = (req, res, next) => {
  const { error } = validateUser(req.body);

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path[0],
      message: detail.message,
    }));
    return res.status(400).json({ errors });
  }

  next();
};

// Login validasyon middleware'i
const validateLoginMiddleware = (req, res, next) => {
  const { error } = validateLogin(req.body);

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path[0],
      message: detail.message,
    }));
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = {
  authenticateToken,
  validateUser: validateUserMiddleware,
  validateLogin: validateLoginMiddleware,
};
