const router = require("express").Router();
const { isLoggedIn } = require("../middleware/route-guard");
const Room = require('../models/Room')

router.get('/rooms/add', (req, res, next) => {
	res.render('rooms/add')
});

router.post('/rooms', (req, res, next) => {
	const { name, price } = req.body
	const userId = req.session.user._id
	Room.create({ name, price, owner: userId })
		.then(createdRoom => {
			res.redirect('/rooms')
		})
		.catch(err => {
			next(err)
		})
});

router.get('/rooms', isLoggedIn, (req, res, next) => {
	const userId = req.session.user._id

  const query = { }
  if (req.session.user.role === "user") {
    query.owner = req.session.user._id
  }

	Room.find(query)
	.populate("owner")
	.then(rooms => {
      console.log("rooms: ", rooms)
			res.render('rooms/index', { rooms })
		})
		.catch(err => {
			next(err)
		})
});

router.get('/rooms/:id/delete', (req, res, next) => {

	const roomId = req.params.id
	const query = { _id: roomId }

	if (req.session.user.role === 'user') {
		query.owner = req.session.user._id
	}
	console.log(query)
	Room.findOneAndDelete(query)
		.then(() => {
			res.redirect('/rooms')
		})
		.catch(err => {
			next(err)
		})
});


module.exports = router;