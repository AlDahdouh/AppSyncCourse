const mongoose = require("mongoose");
const { Schema } = mongoose;

const hobbySchema = new Schema({
  title: String,
  description: String,
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

const Hobby = mongoose.model("Hobby", hobbySchema);

module.exports = Hobby;
