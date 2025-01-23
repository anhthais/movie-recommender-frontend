import { RootState } from "@/app/api/store";
import { CardViewLayout, PlayListMovieCard } from "@/components/custom/playlist-movie-card";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, ListVideo } from "lucide-react";
import { useState } from "react";
import { Grid } from "react-bootstrap-icons";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const WatchListPage = () => {
  const watchListMovies = useSelector((state: RootState) => {
    return state.movieList.watchLater;
  });
  const [cardViewLayout, setCardViewLayout] = useState(CardViewLayout.GRID);
  const [isReversed, setIsReversed] = useState(false);

  const onViewLayoutClick = () => {
    setCardViewLayout((prev) => {
      return prev === CardViewLayout.GRID
        ? CardViewLayout.LIST
        : CardViewLayout.GRID;
    })
  };

  const onReverseClick = () => {
    setIsReversed((prev) => !prev);
  };

  const navigate = useNavigate();

  return (
    <div className="w-full">
      <Helmet>
        <title>Watch list</title>
      </Helmet>
      <div className="w-full flex flex-col max-w-[1200px] mx-auto">
        <div className="px-6 mt-8">
          <h3 className="text-2xl font-semibold">My watch list</h3>          
          <div className="mt-4">
            <Button variant="ghost" className="text-red-500 p-3" onClick={onViewLayoutClick}>
              {
                cardViewLayout == CardViewLayout.GRID
                  ? <Grid className="text-[16px]"/>
                  : <ListVideo className="text-3xl shrink-0" />
              }
            </Button>
            <Button className="p-3" variant="ghost" onClick={onReverseClick}>
              {
                <ArrowDownUp />
              }
            </Button>
          </div>
        </div>
        <div className="px-6 py-4 flex items-center gap-32">
          <div className={`grid mt-4 gap-8 w-full ${cardViewLayout === CardViewLayout.GRID ? 'max-sm:grid-cols-2 max-md:grid-cols-3 max-lg:grid-cols-4 grid-cols-5' : ''}`}>
            {
              (isReversed ? [...watchListMovies].reverse() : watchListMovies).map((movie) => (
                  <PlayListMovieCard
                    viewLayout={cardViewLayout} 
                    key={movie}
                    movieId={movie}
                    onClick={() => navigate(`/movie/${movie}`)}
                  />
              ))  
            }
          </div>
      </div>
    </div>
  </div>
  );
};

export default WatchListPage;