import { MouseEvent, MouseEventHandler, useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Movie, Video } from "@/app/api/types/movie.type";
import { getResourceFromTmdb } from "@/lib/helpers/get-resource-tmbd";
import { Button } from "../ui/button";
import { PlayFill, ThreeDotsVertical } from "react-bootstrap-icons";
import MovieActionPopover from "./movie-action-popover";
import { useTrailerVideoQuery } from "@/app/api/movies/movie-api-slice";
import { TrailerVideoDialog } from "./trailer-video-dialog";

export type MovieCardProps = {
    movie: Movie;
};

export const TrailerCard = (props: MovieCardProps) => {
    const { movie } = props;
    const [loaded, setLoaded] = useState(false);
    const {data: trailersData, isSuccess: isGetTrailersSuccess} = useTrailerVideoQuery(movie.id);
    const [trailer, setTrailer] = useState<Video | undefined>();
    const [openTrailerDialog, setOpenTrailerDialog] = useState(false);

    useEffect(() => {
      if(!isGetTrailersSuccess) {
        return;
      }
      setTrailer(trailersData.data?.results.find(video => video.type == 'Trailer') ?? trailersData.data?.results[0]);
    }, [isGetTrailersSuccess, trailersData])

    const onImageLoad = () => {
        setLoaded(true);
    };

    const onMoreClick: MouseEventHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
    };

    const onCardClick = () => {
      setOpenTrailerDialog((prev) => !prev);
    }
    
    return (
        <>
        <div className="rounded-lg overflow-hidden cursor-pointer shrink-0 w-[300px]" onClick={onCardClick}>
            <div className="w-[300px] h-[168.75px] relative group">
                <img src={getResourceFromTmdb(movie.backdrop_path)} onLoad={onImageLoad} className={`${!loaded ? 'opacity-0' : 'group-hover:blur-sm'} rounded-lg`}/>
                {!loaded && <Skeleton className="top-0 absolute bottom-0 right-0 left-0 opacity-100" />}
                <MovieActionPopover movieId={movie.id}>
                    <Button variant="ghost" size="icon" className="rounded-full shrink-0 absolute top-2 right-2" onClick={onMoreClick}>
                        <ThreeDotsVertical />
                    </Button>
                </MovieActionPopover>
                <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 group-hover:text-destructive">
                  <PlayFill className="text-5xl"/>
                </div>
            </div>
            <div className="mt-2 flex flex-col items-center">
                <span className="font-semibold text-ellipsis line-clamp-1">{movie.original_title}</span>
                <span className="text-sm text-center">{trailer?.name || movie.release_date}</span>
            </div>
        </div>
        {trailer && <TrailerVideoDialog video={trailer} open={openTrailerDialog} onOpenChange={setOpenTrailerDialog}/>}
      </>
    )
}