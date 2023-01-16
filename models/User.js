const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid E-mail address"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimm password length should be 5 chars"],
  },
  firstName: {
    type: String,
    required: [true, "Please enter password"],
    maxLength: [14, "please enter a name which has less than 14 chars"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter password"],
    maxLength: [14, "please enter a name which has less than 14 chars"],
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//static method for login

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("Incorrect Email");
};

userSchema.post("save", function (doc, next) {
  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
