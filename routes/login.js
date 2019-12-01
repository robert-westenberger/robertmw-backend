var express = require('express');
var passport = require('passport');

var router = express.Router();

router.post('/',
  passport.authenticate('local', {failureFlash: true}),
  function(req, res) {
    res.send(200);
  });


module.exports = router;
