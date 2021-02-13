const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String, // String is shorthand for {type: String}
  age: Number,
  profession: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
