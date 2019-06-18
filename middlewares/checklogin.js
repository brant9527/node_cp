module.exports = (req, res, next) => {
  if (!req.session.logined || !req.session.loginUser) {
    return res.redirect('/login')
  }
  next()
}