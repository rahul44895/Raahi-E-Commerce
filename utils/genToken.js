const JWT = require("jsonwebtoken");

const genToken = (user) => {
  const data = {
    user: {
      id: user.id,
    },
  };
  let authToken = JWT.sign(data, process.env.JWT_SECRET_KEY);
  return authToken;
};

module.exports = genToken;
