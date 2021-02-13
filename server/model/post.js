const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  comment: String,
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
