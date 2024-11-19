"use client";

import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";

type MovieDetails = {
  Title: string;
  Year: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
  Genre: string;
  Director: string;
  Actors: string;
  Runtime: string;
  Released: string;
};

export default function MovieSearch() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setMovieDetails(null);
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?t=${searchTerm}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data.Response === "False") {
        throw new Error(data.Error);
      }
      setMovieDetails(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 space-y-6 md:space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">Movie Search</h1>
        <p className="text-center text-gray-600">
          Search for your favorite movies and explore their details.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch space-y-4 sm:space-y-0 sm:space-x-4">
          <Input
            type="text"
            placeholder="Enter a movie title"
            value={searchTerm}
            onChange={handleChange}
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Search
          </Button>
        </div>
        {loading && (
          <div className="flex justify-center">
            <ClipLoader size={30} color="#3B82F6" />
          </div>
        )}
        {error && (
          <div className="text-red-500 text-center">
            {error}. Please try another movie.
          </div>
        )}
        {movieDetails && (
          <div className="space-y-6">
            <Image
              src={
                movieDetails.Poster !== "N/A"
                  ? movieDetails.Poster
                  : "/placeholder.svg"
              }
              alt={movieDetails.Title}
              width={300}
              height={450}
              className="mx-auto rounded-md shadow-md"
            />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">{movieDetails.Title}</h2>
              <p className="italic text-gray-600">{movieDetails.Plot}</p>
              <div className="flex flex-wrap justify-center space-x-4 text-gray-500 mt-4">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{movieDetails.Year}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <StarIcon className="w-4 h-4 text-yellow-500" />
                  <span>{movieDetails.imdbRating}</span>
                </div>
              </div>
              <div className="text-gray-600 space-y-2 mt-4">
                <p><strong>Genre:</strong> {movieDetails.Genre}</p>
                <p><strong>Director:</strong> {movieDetails.Director}</p>
                <p><strong>Actors:</strong> {movieDetails.Actors}</p>
                <p><strong>Runtime:</strong> {movieDetails.Runtime}</p>
                <p><strong>Released:</strong> {movieDetails.Released}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
