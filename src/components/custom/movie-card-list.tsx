import { getResourceFromTmdb } from "@/lib/helpers/get-resource-tmbd";
import { useState } from "react";
import DefaultImage from "./default-image";
import { Link } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import dayjs from "dayjs";
import { Movie } from "@/app/api/types/movie.type";
import { useMovieActions } from "@/hooks/use-movie-actions";
import { Eye, EyeFill, Heart, HeartFill } from "react-bootstrap-icons";
import { RatingIndicator } from "./rating-indicator";

type MovieCardListProps = {
  movie: Movie;
  onClick?: () => void;
};

export const MovieCardList = ({ movie, onClick }: MovieCardListProps) => {
  const [loaded, setLoaded] = useState(false);

  const onImageLoad = () => {
    setLoaded(true);
  };

  const {isLiked, isInWatchLaterList, likeMovie, watchLater} = useMovieActions(movie.id);

  const onLikeActionClick = () => {
    likeMovie();
  }

  const onWatchListActionClick = () => {
    watchLater();
  }

  return (
    <div className="md:h-40 w-full flex bg-gray-rose-gradient-light dark:bg-gray-rose-gradient rounded-md overflow-hidden shadow-lg">
      {movie.poster_path ? (
        <div className="w-24 md:w-28 relative flex h-full flex-shrink-0 hover:cursor-pointer hover:transform hover:scale-105 transition duration-200">
          <img
            onLoad={onImageLoad}
            src={getResourceFromTmdb(movie.poster_path)}
            alt={movie.title}
            className={`w-24 md:w-28 object-cover flex-shrink-0 ${
              !loaded ? "opacity-0" : ""
            }`}
            onClick={onClick}
          />
          {!loaded && (
            <Skeleton className="top-0 absolute bottom-0 right-0 left-0 opacity-100" />
          )}
        </div>
      ) : (
        <DefaultImage
          alt={movie.title}
          className="w-24 md:w-28 flex-shrink-0"
        />
      )}

      <div className="flex flex-col justify-center">
        <div className="py-2 px-3 space-y-4">
          <div className="flex flex-row items-center space-x-2">
            <RatingIndicator rating={movie.vote_average} strokeWidth={2} />
            <div>
              <Link
                to={`/movie/${movie.id}`}
                className="inline-flex space-x-2"
              >
                <span className="text-lg font-semibold hover:text-key line-clamp-1 md:line-clamp-none">
                  {movie.title}
                </span>
                {movie.original_title &&
                  movie.original_title !== movie.title && (
                    <span className="italic text-primary/70 hidden md:block">
                      ({movie.original_title})
                    </span>
                  )}
              </Link>
              {movie.release_date && (
                <p className="text-sm text-primary/70">
                  {dayjs(movie.release_date).format("MMM DD, YYYY")}
                </p>
              )}
            </div>
          </div>
          {movie.overview && (
            <p className="text-sm line-clamp-2 text-primary/80">
              {movie.overview}
            </p>
          )}
        </div>
        <div className="flex flex-row space-x-4 m-3 text-primary/70">
          <div className={`flex space-x-1 items-center`}>
            {isInWatchLaterList ? (
              <>
                <EyeFill
                  className="text-green-600 hover:cursor-pointer hover:transform hover:scale-125 duration-200"
                  size={20}
                  onClick={onWatchListActionClick}
                />
                <span className="text-xs hidden sm:block">
                  Remove from watch list
                </span>
              </>
            ) : (
              <>
                <Eye
                  className="hover:text-green-600 hover:cursor-pointer hover:transform hover:scale-125 duration-200"
                  size={20}
                  onClick={onWatchListActionClick}
                />
                <span className="text-xs hidden sm:block">
                  Add to watch list
                </span>
              </>
            )}
          </div>
          <div className={`flex space-x-1 items-center`}>
            {isLiked ? (
              <>
                <HeartFill
                  className="text-pink-600 hover:cursor-pointer hover:transform hover:scale-125 duration-200"
                  size={18}
                  onClick={onLikeActionClick}
                />
                <p className="text-xs hidden sm:block">Unlike</p>
              </>
            ) : (
              <>
                <Heart
                  className="hover:text-pink-600 hover:cursor-pointer hover:transform hover:scale-125 duration-200"
                  size={18}
                  onClick={onLikeActionClick}
                />
                <p className="text-xs hidden sm:block">Like</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};