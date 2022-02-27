const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    Link: String,
    Title: String,
    Words: [String],
  },
  { collection: "blogs" }
);

module.exports = mongoose.model("Blog", blogSchema, "blogs");
