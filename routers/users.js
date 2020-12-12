const userRouter = require('express').Router();
const { param, body, validationResult } = require('express-validator');

const { userDoc } = require('../db/mongoose');

/**
 * @api {post} /api/users Create a New User.
 * @apiName PostUser
 * @apiGroup Users
 * @apiVersion 0.1.0
 *
 * @apiSuccess {object} user Newly Created User information.
 * @apiSuccess {String} username User's username
 *
 * @apiSuccessExample {json} Success-Response:
 * 		HTTP/1.1 200 OK
 * 		{
 * 			"username": "John Doe"
 * 		}
 */
userRouter.post(
	'/',
	[
		body('username').isString().isLength({ min: 5, max: 100 }),
		body('password').isString().isLength({ min: 6, max: 100 }),
		body().custom((body) => (Object.keys(body).length < 3 ? Promise.resolve() : Promise.reject())),
	],
	async (req, res) => {
		try {
			console.log('POST');
			console.log(req.body);
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}
			//validate every property from start to finish
			//here we skipped password hashing and strength
			//here we skipped username validation (is string length min max)
			const newUser = new userDoc(req.body);
			const userRes = await newUser.save();
			if (!userRes) {
				throw new Error('failed to make user');
			}

			userRes.password = undefined;

			return res.json(userRes);
		} catch (e) {
			console.error(e);
			return res.sendStatus(400);
		}
	}
);

/**
 * @api {get} /api/users/:id Fetch a Single User by its Id.
 * @apiName GetUser
 * @apiGroup Users
 * @apiVersion 0.1.0
 *
 * @apiParam {String} id Id of the User being fetched.
 *
 * @apiSuccess {object} user Fetched user's information.
 * @apiSuccess {String} username User's username
 *
 * @apiSuccessExample {json} Success-Response:
 * 		HTTP/1.1 200 OK
 * 		{
 * 			"username": "John Doe"
 * 		}
 */

userRouter.get('/:id', [param('id').isMongoId()], async (req, res) => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const user = await userDoc.findById(req.params.id);

		if (!user) {
			throw new Error(`Can not find a user by this id`);
		}

		user.password = undefined;

		return res.json(user);
	} catch (e) {
		console.error(e);
		return res.sendStatus(500);
	}
});

/**
 * @api {get} /api/users/s/:search Search for a user with the username
 * @apiName SearchUser
 * @apiGroup Users
 * @apiVersion 0.1.0
 *
 * @apiSuccess {object} user Fetched user's information	
 */
userRouter.get('/s/:search',[param('search').isString({ min: 5, max: 100 })], async (req, res) => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const users = await userDoc.find({username : req.params.search});

		if (!users) {
			throw new Error(`Can not find a user by this username`);
		}
		return res.json(users);
 	} catch (e) {
 		console.error(e);
 		return res.sendStatus(500);
 	}
 });

/**
 * @api {get} /api/users Fetch all the available users
 * @apiName GetUser
 * @apiGroup Users
 * @apiVersion 0.1.0
 *
 * @apiSuccess {object[]} users List of all users
 */
userRouter.get('/', async (req, res) => {
	try {
		const users = await userDoc.find({});
		if (!users) {
			throw new Error('No users were found');
		}
		return res.json(users);
	} catch (e) {
		console.error(e);
		return res.sendStatus(500);
	}
});
module.exports = userRouter;
