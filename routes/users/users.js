var express = require('express');
var router = express.Router();
const userController = require('./controller/userController');
const { verifyToken } = require('../../middleware/authorization');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login-test', (req, res) => res.send(res.send({
  firstName: 'Kwainasia',
  lastName: 'Favors', 
  email: req.body.email 
})))

router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/authtoken', verifyToken, userController.authtoken )

module.exports = router;
