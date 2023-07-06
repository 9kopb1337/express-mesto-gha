const jwt = require("jsonwebtoken");
const { ERROR_UNAUTHORIZED } = require("../errors/error");

const auth = (req, res, next) => {

  const token = req.coockies.jwt;

  let payload;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Необходима авторизация" });
  }

  try {
    payload = jwt.verify(token, "super-strong-secret");
  } catch (err) {
    return res.status(401).send({ message: "Необходима авторизация" });
  }

  req.user = payload;
  next();
};

module.exports = { auth };
