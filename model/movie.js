const mongoose = require("mongoose");
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const movieSchema = new mongoose.Schema({
    movie_name: { type: String, required: true },
    rating: { type: Number },
    cast: { type: Array },
    genre: { type: String },
    release_date: { type: Date },
    user_id: {type: ObjectId, required: true}
});

movieSchema.index({ movie_name: 1, user_id: 1}, { unique: true }); //added index for combination of movie name and user id to be unique
module.exports = mongoose.model("movie", movieSchema);