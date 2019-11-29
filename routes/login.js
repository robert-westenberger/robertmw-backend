var express = require('express');
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var router = express.Router();
var { models } = require('../models');

router.post('/',
  passport.authenticate('local',),
  function(req, res) {
    res.send(200);
  });

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       if (!user.verifyPassword(password)) { return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));


// router.post('/', function(req, res, next) {
//   const { username, password } = req.body;
//   models.User.findOne({where: {username}}).then(user => {
//     if (user) {
//       bcrypt.compare(password, user.password()).then(result => {
//         if (result) {
//           return res.status(200).send();
//         }
//         return res.status(401).format({json: () => res.send({ error: "Incorrect username or password."})});
//       })
//     } else {
//       return res.status(401).format({json: () => res.send({ error: "Incorrect username or password."})});
//     }
//   });
// });

module.exports = router;
