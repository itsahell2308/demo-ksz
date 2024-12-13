import { Request, Response } from "express";
import * as response from "../helpers/response.helper";
import movies from "../config/movies.json";
import Movie from "../models/movie.model";

const genreOptions = [
  "Action",
  "Romance",
  "Fantasy",
  "Drama",
  "Crime",
  "Adventure",
  "Thriller",
  "Sci-fi",
  "Music",
  "Family",
];

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const page: number = req.query.page ? Number(req.query.page) - 1 : 0;
    const limit: number = req.query.limit ? Number(req.query.limit) : 5;
    console.log("🚀 ~ getAll ~ limit:", limit);
    const search: string = (req.query.search as string) || "";
    console.log("🚀 ~ getAll ~ search:", search);
    let sort: string[] = Array.isArray(req.query.sort)
      ? (req.query.sort as string[])
      : [(req.query.sort as string) || "rating"];
    let genre: string[] = [];
    if (req.query.genre) {
      if (typeof req.query.genre === "string") {
        genre =
          req.query.genre === "all"
            ? [...genreOptions]
            : req.query.genre.split(",");
      } else if (Array.isArray(req.query.genre)) {
        genre = req.query.genre as string[];
      }
    } else {
      genre = [...genreOptions]; // Default all genres if none provided
    }

    let sortBy: any = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "asc";
    }
    console.log("🚀 ~ getAll ~ sortBy:", sortBy);

    const moviesData: any = await Movie.find({
      name: { $regex: search, $options: "i" },
    })
      .where("genre")
      .in(genre)
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);
    console.log("🚀 ~ getAll ~ moviesData:", moviesData);

    const total = await Movie.countDocuments({
      genre: { $in: genre },
      name: { $regex: search, $options: "i" },
    });
    console.log("🚀 ~ getAll ~ total:", total);

    const responseData = {
      data: moviesData,
      total: total,
      page: page + 1,
      limit: limit,
      totalPages: Math.ceil(total / limit),
      genreOptions: genreOptions,
      search: search,
    };

    response.success(res, "Movies fetched successfully.", responseData);
  } catch (error: any) {
    console.log("🚀 ~ Movies ~ error:", error.message);
    response.error(res, error);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const createdMovies = await Movie.insertMany(movies);
    response.success(res, "Movies created successfully.", createdMovies);
  } catch (error: any) {
    console.log("🚀 ~ Movies ~ error:", error.message);
    response.error(res, error);
  }
};
