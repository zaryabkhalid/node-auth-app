import mongoose from "mongoose";
import bcrypt from "bcrypt";
import regEx from "../../validations/regex";
import crypto from "crypto";

const { Schema } = mongoose;

const UserSchema = new Schema(
	{
		firstname: {
			type: String,
			required: [true, "Firstname is required!"],
			minlength: [3, "Firstname must have at least 3 characters"],
			maxlength: [16, "Firstname must not have more than 16 characters"],
			trim: true,
			validate: {
				validator: value => regEx.NAME_REG_EX.test(value),
				message: "Invalid format Firstname must contain letters only!",
			},
			lowercase: true,
		},
		lastname: {
			type: String,
			required: [true, "Lastname is required!"],
			minlength: [3, "Lastname must have at least 3 characters"],
			maxlength: [16, "Lastname must not have more than 16 characters"],
			trim: true,
			validate: {
				validator: value => regEx.NAME_REG_EX.test(value),
				message: "Invalid format Lastname must contain letters only!",
			},
			lowercase: true,
		},
		username: {
			type: String,
			required: [true, "Username is required!"],
			minlength: [3, "Username must have at least 3 characters"],
			maxlength: [16, "Username must not have more than 16 characters"],
			unique: true,
			trim: true,
			validate: {
				validator: value => regEx.USER_REG_EX.test(value),
				message: "Invalid format Username must contain letters and numbers only!",
			},
			lowercase: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			trim: true,
			validate: {
				validator: value => regEx.EMAIL_REG_EX.test(value),
				message: "Email format is not valid",
			},
			lowercase: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			trim: true,
			select: false,
		},
		confirm_password: {
			type: String,
			required: [true, "Please confirm your password"],
			validate: {
				validator: function (val) {
					return val == this.password;
				},
				message: "Password & Confirm Password does not match",
			},
		},

		passwordChangedAt: {
			type: Date,
		},
		passwordResetToken: {
			type: String,
		},
		passwordResetTokenExpire: {
			type: Date,
		},

		isVerified: {
			type: Boolean,
			default: false,
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
UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	//* encrypt password before saving data
	this.password = await bcrypt.hash(this.password, 12);
	this.confirm_password = undefined;
	next();
});

UserSchema.methods.comparePassword = async function (password, passwordDB) {
	return await bcrypt.compare(password, passwordDB);
};

UserSchema.methods.createResetPasswordToken = function () {
	const resetToken = crypto.randomBytes(32).toString("hex");
	this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
	this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000;
	console.log(resetToken, this.passwordResetToken);
	return resetToken;
};

export const User = mongoose.model("Users", UserSchema);
