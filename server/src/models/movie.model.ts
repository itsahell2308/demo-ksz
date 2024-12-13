import mongoose from "mongoose";

export const movieSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    img: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: [String], required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
