var config = {
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  user: process.env.USER,
  recipient: process.env.RECIPIENT,
  refreshToken: process.env.REFRESHTOKEN,
  accessToken: process.env.ACCESSTOKEN,
  mlabconnection: process.env.MLAB_CONNECTION,
  admin: process.env.ADMIN
}

module.exports = config;