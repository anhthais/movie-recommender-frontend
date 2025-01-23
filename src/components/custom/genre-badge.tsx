import { useNavigate } from "react-router-dom";
import { Genre } from "@/app/api/types/movie.type";

type GenreBadgeProps = {
  genre: Genre;
};

const GenreBadge = ({ genre }: GenreBadgeProps) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-secondary hover:bg-keysecondary hover:text-key-foreground text-primary cursor-pointer px-4 py-1 rounded-full text-sm"
      onClick={() => {
        navigate(`/movie?genres=${genre.id}`);
      }}
    >
      {genre.name}
    </div>
  );
};

export default GenreBadge;