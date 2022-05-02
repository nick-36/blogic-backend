const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) res.status(401).json("Token is Invalid");
        req.user = user;
        next();
      });
    } else {
      res.status(400).json("You are not Authenticated");
    }
  }
};

const verifyTokenAndAuthor = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.body.id) {
      next();
    } else {
      res.status(403).json("YOU ARE NOT ALLOWED TO DO THAT!!!");
    }
  });
};

module.exports = { verifyToken, verifyTokenAndAuthor };
