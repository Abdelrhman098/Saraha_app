import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 30,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 30,
      lowercase: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 100,
    },
    email: {
      type: String,
      required: true,
      index: {
        unique: true,
        name: "emailIndex",
      },
    },
    password: {
      type: String,
      required: true,
      min: [6, "must be at least 6 characters"],
      max: 1024,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    virtuals: {
      fullName: {
        get() {
          return `${this.firstName} ${this.lastName}`;
        },
      },
    },
  }
);

userSchema.index(
  { firstName: 1, lastName: 1 },
  { unique: true, name: "FullNameIndex" }
);

const User = mongoose.model("User", userSchema);
export default User;
