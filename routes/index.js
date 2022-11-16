const router = require("express").Router();
const { isLoggedIn } = require('../middleware/route-guard');

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", isLoggedIn, (req, res, next) => {

const user = req.session.user
  res.render("profile", { user: user })
})


router.get("/private", isLoggedIn, (req, res) => {
  res.render("private")
})

router.get("/main", isLoggedIn, (req,res) => {
  res.render("main")
})

module.exports = router;
