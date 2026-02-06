// TODO: Build middleware that redirects unauthenticated users to /login.
module.exports = function withAuth(req, res, next) {
  // if (!req.session.logged_in) return res.redirect('/login');
  if (!req.session.logged_in) {
    return res.redirect('/login') 
  }
  else{next();}
  
};
