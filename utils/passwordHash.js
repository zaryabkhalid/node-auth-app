import bcrypt from "bcrypt";

const genHashPassword = async password => {
	try {
		const hashPassword = await bcrypt.hash(password, 10);
		return hashPassword;
	} catch (error) {
		throw new Error("password encryption failed");
	}
};

export default genHashPassword;
