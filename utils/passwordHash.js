import bcrypt from "bcrypt";

const genPasswordHash = async password => {
	const hashPassword = await bcrypt.hash(password, 10);
	return hashPassword;
};

export default genPasswordHash;
