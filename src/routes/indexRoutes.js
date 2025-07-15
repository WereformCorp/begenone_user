const express = require('express');
const userRouter = require('./user/userRoutes');
const meRouter = require('./me/meRoutes');
const notificationRouter = require('./notification/notificationRoutes');
const eventRouter = require('./events/eventRoutes');
const checkEmailUsernameExistense = require('../controllers/checkEmailUsernameExistence');

const router = express.Router({ mergeParams: true });

router.post('/check-existence', checkEmailUsernameExistense);

router.use('/user', userRouter);
router.use('/me', meRouter);
router.use('/notification', notificationRouter);
router.use('/event', eventRouter);

module.exports = router;
