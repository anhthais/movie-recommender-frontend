import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Movie } from "@/app/api/types/movie.type";
import { getResourceFromTmdb } from "@/lib/helpers/get-resource-tmbd";
import { useNavigate } from "react-router-dom";

export type MovieCardProps = {
    movie: Movie
}

export const MovieCard = (props: MovieCardProps) => {
    const navigate = useNavigate();
    const { movie } = props;

    const [loaded, setLoaded] = useState(false);

    const onImageLoad = () => {
        setLoaded(true);
    };
    const onMovieCardClick = ()=>{
        navigate('/movie/' + movie.id);
        return;
    }
    return (
        <div className="rounded-lg overflow-hidden cursor-pointer shrink-0" onClick={onMovieCardClick}>
            <div className="w-40 relative h-[15rem]">
                <img src={getResourceFromTmdb(movie.poster_path)} onLoad={onImageLoad} className={`${!loaded ? 'opacity-0' : ''}`}/>
                {!loaded && <Skeleton className="top-0 absolute bottom-0 right-0 left-0 opacity-100" />}
            </div>
            <div className="mt-2 flex flex-col">
                <span className="font-semibold">{movie.original_title}</span>
                <span className="text-sm">{movie.release_date}</span>
            </div>
        </div>
    )
}