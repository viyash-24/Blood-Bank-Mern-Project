const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    // Ensure req.body exists even for GET/HEAD requests
    req.body = req.body || {};

    const authHeader = req.headers.authorization || req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).send({
        success: false,
        message: "Authorization header missing",
      });
    }

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).send({
        success: false,
        message: "Invalid authorization format",
      });
    }

    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Auth Failed",
        });
      } else {
        req.userId = decode.userId;
        // Back-compat with existing controllers expecting req.body.userId
        req.body.userId = decode.userId;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      error,
      message: "Auth Failed",
    });
  }
};
