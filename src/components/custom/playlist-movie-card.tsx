import { MouseEvent, MouseEventHandler, useEffect, useMemo, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Movie } from "@/app/api/types/movie.type";
import { getResourceFromTmdb } from "@/lib/helpers/get-resource-tmbd";
import { Button } from "../ui/button";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import MovieActionPopover from "./movie-action-popover";
import { useMovieDetailQuery } from "@/app/api/movies/movie-api-slice";
import { ratingScore } from "./rating-picker";
import dayjs from "dayjs";

export enum CardViewLayout {
  GRID = 'grid',
  LIST = 'list',
};

export type PlaylistMovieCardProps = {
  movieId: number;
  onClick?: () => void;
  viewLayout: CardViewLayout;
  rating?: number;
};

export const PlayListMovieCard = (props: PlaylistMovieCardProps) => {
    const [ movie, setMovie ] = useState<Movie | undefined>();
    const { movieId, onClick, viewLayout, rating } = props;
    const [loaded, setLoaded] = useState(false);
    const { data: movieData, isSuccess } = useMovieDetailQuery({id: movieId.toString()});

    useEffect(() => {
      if(!isSuccess)
          return;
      setMovie(movieData.data!);
    }, [isSuccess, movieData]);

    const onImageLoad = () => {
      setLoaded(true);
    };

    const isGridView = useMemo(() => {
      return viewLayout === CardViewLayout.GRID;
    }, [viewLayout]);

    const onMoreClick: MouseEventHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
    };
    
    return (
        <div className={`rounded-lg overflow-hidden cursor-pointer shrink-0 justify-self-center ${isGridView ? 'flex flex-col w-32 md:w-40' : 'flex w-full gap-4 bg-gray-rose-gradient-light dark:bg-gray-rose-gradient h-[135px]'}`} onClick={onClick}>
          <div className={`relative group shrink-0 ${isGridView ? 'w-32 md:w-40 h-[12rem] md:h-[15rem]' : 'w-[240px]'}`}>
              <img 
                src={movie?.poster_path 
                  ? getResourceFromTmdb(
                  (isGridView ? movie.poster_path : movie.backdrop_path)
                ) : ''} 
                onLoad={onImageLoad} 
                className={`${!loaded ? 'opacity-0' : 'group-hover:blur-sm'} rounded-lg`}/>
              {!loaded && <Skeleton className="top-0 absolute bottom-0 right-0 left-0 opacity-100" />}
              <MovieActionPopover movieId={movieId}>
                  <Button variant="ghost" size="icon" className="rounded-full shrink-0 absolute top-2 right-2 text-white" onClick={onMoreClick}>
                      <ThreeDotsVertical />
                  </Button>
              </MovieActionPopover>
          </div>
          <div className="mt-2 flex flex-col px-1 gap-0.5">
              <span className="font-semibold text-ellipsis line-clamp-1">{movie?.original_title}</span>
              <span className="text-sm text-primary/80">{dayjs(movie?.release_date).format("MMM DD YYYY")}</span>
              <p className={`line-clamp-2 text-sm ${isGridView ? 'text-xs' : ''}`}>
                {movie?.overview}
              </p>
              {
                rating && (
                  <p className="text-xs mt-1 bg-secondary/80 rounded-full py-1 text-center">
                    You felt {ratingScore[rating as keyof typeof ratingScore].title} {ratingScore[rating as keyof typeof ratingScore].emoji}
                  </p>
                )
              }
          </div>
      </div>
    )
}