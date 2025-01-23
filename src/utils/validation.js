const Joi = require("joi");

const userSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Geçerli bir email adresi giriniz",
    "any.required": "Email adresi zorunludur",
  }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      "string.min": "Şifre en az 8 karakter olmalıdır",
      "string.pattern.base":
        "Şifre en az bir büyük harf ve bir rakam içermelidir",
      "any.required": "Şifre zorunludur",
    }),
  firstName: Joi.string().required().messages({
    "any.required": "Ad zorunludur",
  }),
  lastName: Joi.string().required().messages({
    "any.required": "Soyad zorunludur",
  }),
  role: Joi.string().valid("user", "admin").default("user").messages({
    "any.only": "Rol sadece 'user' veya 'admin' olabilir",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Geçerli bir email adresi giriniz",
    "any.required": "Email adresi zorunludur",
  }),
  password: Joi.string().required().messages({
    "any.required": "Şifre zorunludur",
  }),
});

const validateUser = (data) => {
  return userSchema.validate(data, { abortEarly: false });
};

const validateLogin = (data) => {
  return loginSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateUser,
  validateLogin,
};
