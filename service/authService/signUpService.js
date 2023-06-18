import { User } from "../../models/authentication/users.model";
import genPasswordHash from "../../utils/passwordHash";

export async function signupService(userData) {
	const { firstname, lastname, username, email, password } = userData;
	try {
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
	} catch (error) {
		next(error);
	}
}
