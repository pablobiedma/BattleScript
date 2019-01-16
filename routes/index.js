var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/splash', function(req, res) {
  res.sendFile("splash.html", {root: "./public"});
});

router.get("/play", function(req,res){
  res.sendFile("gamescreen.html", {root: "./public"});
});

module.exports = router;
