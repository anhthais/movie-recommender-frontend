import { useNavigate } from "react-router-dom";
import { MovieKeywords } from "@/app/api/types/movie.type";

type KeywordBadgeProps = {
  keyword: MovieKeywords;
};

const KeywordBadge = ({ keyword }: KeywordBadgeProps) => {
  // const navigate = useNavigate();
  return (
    <div
      className="bg-secondary text-primary cursor-pointer px-4 py-1 rounded-full text-sm"
      // onClick={() => {
      //   navigate(`/movie?genres=${keyword.id}`);
      // }}
    >
      {keyword.name}
    </div>
  );
};

export default KeywordBadge;
