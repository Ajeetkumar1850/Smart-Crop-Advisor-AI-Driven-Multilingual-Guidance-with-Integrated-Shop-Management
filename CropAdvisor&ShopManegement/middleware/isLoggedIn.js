// middleware/isLoggedIn.js
module.exports = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login'); // or show a flash message
  }
  next();
};
