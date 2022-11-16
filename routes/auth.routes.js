// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model")


router.get('/auth/signup', (req, res) => res.render('auth/signup'));

router.post("/auth/signup", (req, res, next) => {
    const { username, password } = req.body
    if (username === "") {
      res.render("signup", { message: "Username cannot be empty" })
      return
    }
    if (password.length < 4) {
      res.render("signup", { message: "Password has to be minimum 4 characters" })
      return
    }
    User.findOne({ username })
        .then(userFromDB => {
      console.log(userFromDB)

      if (userFromDB !== null) {
        res.render("signup", { message: "Username is already taken" })
      } else {
     
        const salt = bcrypt.genSaltSync()
        const hash = bcrypt.hashSync(password, salt)
        console.log(hash)

        User.create({ username: username, password: hash })
          .then(createdUser => {
            console.log(createdUser)
            res.redirect("/auth/login")
          })
          .catch(err => {
            next(err)
          })
      }
    })

})
router.get("/auth/login", (req, res, next) => {
    res.render("auth/login")
  })
  
  router.post("/auth/login", (req, res, next) => {
    const { username, password } = req.body
  
    User.findOne({ username })
    .then(userFromDB => {
      if (userFromDB === null) {
        res.render("auth/login", { message: "Wrong credentials" })
        return
      }

      if (bcrypt.compareSync(password, userFromDB.password)) {
        req.session.user = userFromDB
        res.redirect("/profile")
      } else {
        res.render("auth/login", { message: "Wrong credentials" })
        return
      }
    })
})


router.get("/auth/logout", (req, res, next) => {
    req.session.destroy()
    res.redirect("/")
  })
  


module.exports = router;
