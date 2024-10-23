import mongoose, { Schema } from "mongoose";

const USER =
	mongoose.models.USER ||
	mongoose.model(
		"USER",
		new Schema(
			{
				username: {
					type: String,
					required: [true, "Username required"],
				},
				email: {
					type: String,
					required: [true, "Email required"],
				},
				hashedPassword: {
					type: String,
					required: [true, "<hashedPassword> didn't reach"],
				},
				friends: [
					{
						type: mongoose.Schema.Types.ObjectId,
						ref: "USER",
					},
				],
			},
			{ timestamps: true }
		)
	);
export default USER;
