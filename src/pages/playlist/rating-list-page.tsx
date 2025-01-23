import { useGetRatingsQuery } from "@/app/api/movies/movie-api-slice";
import { CardViewLayout, PlayListMovieCard } from "@/components/custom/playlist-movie-card";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, ListVideo } from "lucide-react";
import { useState } from "react";
import { Grid } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import noDataImg from "@/assets/nodata-image.svg";
import { Helmet } from "react-helmet";

const RatingListPage = () => {
  const {data: ratingsData} = useGetRatingsQuery();
  const [cardViewLayout, setCardViewLayout] = useState(CardViewLayout.GRID);
  const [isReversed, setIsReversed] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div className="w-full">
      <Helmet>
        <title>Ratings</title>
      </Helmet>
      <div className="w-full flex flex-col max-w-[1200px] mx-auto">
        <div className="px-6 mt-8">
          <h3 className="text-2xl font-semibold">Ratings</h3>          
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
        {
          ratingsData?.data?.length == 0 
            ? (
              <div className="flex-col w-full justify-center items-center">
                <img src={noDataImg} className="max-w-64 mx-auto"/>
                <p className="mt-4 text-center ">You don't have any ratings</p>
              </div>
            )
            : (
              <div className="px-6 py-4 flex items-center gap-32">
                {ratingsData?.data && ratingsData.data.length > 0 && <div className={`grid mt-4 gap-8 w-full ${cardViewLayout === CardViewLayout.GRID ? 'max-sm:grid-cols-2 max-md:grid-cols-3 max-lg:grid-cols-4 grid-cols-5' : ''}`}>
                  {
                    (isReversed ? [...ratingsData.data].reverse() : ratingsData.data).map((movie) => (
                        <PlayListMovieCard
                          viewLayout={cardViewLayout} 
                          key={movie.movieId}
                          rating={movie.score}
                          movieId={movie.movieId}
                          onClick={() => navigate(`/movie/${movie.movieId}`)}
                        />
                    ))  
                  }
                </div>}
            </div>
            )
        }
    </div>
  </div>
  );
};

export default RatingListPage;