import { MouseEvent, MouseEventHandler, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Movie } from "@/app/api/types/movie.type";
import { getResourceFromTmdb } from "@/lib/helpers/get-resource-tmbd";
import { Button } from "../ui/button";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import MovieActionPopover from "./movie-action-popover";
import dayjs from "dayjs";
import DefaultImage from "./default-image";
import { RatingIndicator } from "./rating-indicator";

export type MovieCardProps = {
    movie: Movie;
    onClick?: () => void;
}

export const MovieCard = (props: MovieCardProps) => {
   
    const { movie, onClick } = props;

    const [loaded, setLoaded] = useState(false);

    const onImageLoad = () => {
        setLoaded(true);
    };

    const onMoreClick: MouseEventHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
    };
    
    return (
      <div
        className="rounded-lg overflow-hidden cursor-pointer shrink-0 w-32 md:w-40"
        onClick={onClick}
      >
        <div className="w-32 md:w-40 relative h-[12.5rem] md:h-[15rem] group">
          {movie.poster_path ? (
            <>
              <img
                src={getResourceFromTmdb(movie.poster_path)}
                onLoad={onImageLoad}
                className={`${
                  !loaded
                    ? "opacity-0"
                    : "group-hover:scale-105 transition duration-200"
                } w-32 md:w-40 object-cover h-[12.5rem] md:h-[15rem] flex-shrink-0`}
              />
              {!loaded && (
                <Skeleton className="top-0 absolute bottom-0 right-0 left-0 opacity-100" />
              )}
            </>
          ) : (
            <DefaultImage
              alt={movie.title}
              className="w-32 md:w-40 h-[12.5rem] md:h-[15rem] flex-shrink-0"
            />
          )}
          <div className="absolute -bottom-4 left-6 transform -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-start">
            <RatingIndicator rating={movie.vote_average} />
          </div>
          <MovieActionPopover movieId={movie.id}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full shrink-0 absolute top-2 right-2 z-100 text-white"
              onClick={onMoreClick}
            >
              <ThreeDotsVertical />
            </Button>
          </MovieActionPopover>
        </div>
        <div className="mt-4 flex flex-col">
          <span className="font-semibold text-ellipsis line-clamp-1">
            {movie.original_title}
          </span>
          <span className="text-sm">
            {dayjs(movie.release_date).format("MMM DD YYYY")}
          </span>
        </div>
      </div>
    );
}