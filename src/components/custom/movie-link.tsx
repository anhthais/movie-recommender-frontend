import { cn } from "@/lib/utils";
import { BoxArrowUpRight } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

type MovieCardMiniProps = {
  movieId: number;
  movieName: string;
};

const MovieLink = ({ movieId, movieName }: MovieCardMiniProps) => {
  return (
    <Link
      to={`/movie/${movieId}`}
      className={cn(
        "inline-flex items-center space-x-2 hover:text-blue-500 transition-colors duration-300",
        "hover:scale-105 transform"
      )}
    >
      <span className="font-semibold">{movieName}</span>
      <BoxArrowUpRight className="h-4 w-4 shrink-0" />
    </Link>
  );
}

export default MovieLink;
