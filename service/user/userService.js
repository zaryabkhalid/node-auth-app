import { User } from "../../models/authentication/users.model";
import genPasswordHash from "../../utils/passwordHash";

async function getUser(email) {
	const user = await User.findOne({ email: email }).exec();
	return user;
}

async function createUser(userData) {
	const { firstname, lastname, username, email, password } = userData;
	//** password Hashing before saving user */
	const hashPassword = await genPasswordHash(password);

	const user = new User({
		firstname,
		lastname,
		username,
		email,
		password: hashPassword,
	});

	const newUser = await User.create(user);
	return newUser;
}

export { getUser, createUser };
