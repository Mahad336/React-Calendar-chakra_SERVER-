const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message === "Incorrect Email") {
    errors.email = "Email is not registered ...";
  }

  if (err.message === "incorrect password") {
    errors.password = "Incorrect Password ...";
  }
  if (err.code === 11000) {
    //Check duplicate Emails
    errors.email = "Email already used ...";
    return errors;
  }
  //Email Validations
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.secretKey, { expiresIn: maxAge });
};

const logout = (request, response) => {
  response.cookie("jwt", "", { maxAge: 1 });
  response.json("Logged out");
};

const signup = async (request, response) => {
  const { email, password, firstName, lastName } = request.body;
  try {
    const user = await User.create({ email, password, firstName, lastName });
    const token = createToken(user._id);
    response.cookie("jwt", token, { maxAge: maxAge * 1000 });
    response.status(201).json({ user: user._id, email: user.email });
  } catch (error) {
    const errors = handleErrors(error);
    response.status(404).json({ errors });
  }
};

const login = async (request, response) => {
  const { email, password } = request.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);

    response.cookie("jwt", token, { maxAge: maxAge * 1000 });
    response.status(200).json({ user: user._id, email: user.email });
  } catch (err) {
    const errors = handleErrors(err);
    response.status(400).json({ errors });
  }
};

module.exports = {
  signup,
  login,
  logout,
};
