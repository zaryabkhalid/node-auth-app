import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
	{
		firstname: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		lastname: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		username: {
			type: String,
			unique: true,
			trim: true,
			lowercase: true,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},

		dob: {
			type: Date,
		},

		role: {
			type: String,
			default: "User",
			enum: ["Admin", "User"],
		},

		profilepic: {
			type: String,
			trim: true,
		},

		isVerified: {
			type: Boolean,
			default: false,
		},

		socialmedialinks: {
			type: [String],
		},
		refreshToken: [String],
	},
	{
		timestamps: true,
	},
);

export const User = mongoose.model("Users", UserSchema);
