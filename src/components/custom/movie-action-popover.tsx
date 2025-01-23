import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Popover } from "../ui/popover";
import { MouseEvent, ReactElement } from "react";
import { MovieAction } from "@/constants/movies";
import { useMovieActions } from "@/hooks/use-movie-actions";
import { Eye, EyeFill, Heart, HeartFill } from "react-bootstrap-icons";

export type MovieActionPopoverProps = {
    children: ReactElement;
    movieId: number;
};

export type MovieActionItem = {
    type: MovieAction;
    icon: ReactElement;
    name: string;
    color?: string;
};

const MovieActionPopover = (props: MovieActionPopoverProps) => { 
  const { children, movieId } = props;
  const {isLiked, isInWatchLaterList, likeMovie, watchLater} = useMovieActions(movieId);

  const onLikeActionClick = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    likeMovie();
  };

  const onWatchListActionClick = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    watchLater();
  }; 

    return (
      <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent
          className="bg-popover/85 shadow-xl z-[100] rounded-xl"
          sideOffset={4}
        >
          <div>
            <ul className="grid gap-3 px-2 py-2 text-sm">
              <div
                className="flex gap-4 items-center px-4 py-2 hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:transform duration-200 rounded-lg"
                onClick={onWatchListActionClick}
              >
                {isInWatchLaterList ? (
                  <>
                    <EyeFill className="text-green-600" />
                    <p>Remove from watch list</p>
                  </>
                ) : (
                  <>
                    <Eye />
                    <p>Add to watch list</p>
                  </>
                )}
              </div>
              <div
                className={`flex gap-4 items-center px-4 py-2 hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:transform duration-200 rounded-lg`}
                onClick={onLikeActionClick}
              >
                {isLiked ? (
                  <>
                    <HeartFill className="text-pink-600" />
                    <p>Unlike this movie</p>
                  </>
                ) : (
                  <>
                    <Heart />
                    <p>Like this movie</p>
                  </>
                )}
              </div>
            </ul>
          </div>
        </PopoverContent>
      </Popover>
    );
};

export default MovieActionPopover;