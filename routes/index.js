var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/jquery', function(req, res, next) {
  res.render('user');
});

module.exports = router;
