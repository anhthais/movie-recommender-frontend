import { useLazyGetKeywordQuery, useLazyMovieTrendingQuery, useNowPlayingQuery, usePopularMoviesQuery } from "@/app/api/movies/movie-api-slice";
import { Movie, MovieMediaType, MovieTrailerType, MovieTrendingDuration, SearchKeyword } from "@/app/api/types/movie.type";
import { MovieCard } from "@/components/custom/movie-card";
import { MovieCardSkeleton } from "@/components/custom/movie-card-sekeleton";
import { SliderButton } from "@/components/custom/slider-button";
import { TrailerCard } from "@/components/custom/trailer-card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useTopBarLoader } from "@/hooks/use-top-loader";
import { delay } from "@/lib/helpers/delay";
import { Search } from "lucide-react";
import {  ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
    const navigate = useNavigate();
    const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
    const [trendingDuration, setTrendingDuration] = useState<MovieTrendingDuration>(MovieTrendingDuration.DAY);
    const [trailerType, setTrailerType] = useState<MovieTrailerType>(MovieTrailerType.POPULAR);
    const [isTrendingLoading, setIsTrendingLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { staticStart: startTopBar, complete: completeTopBar } = useTopBarLoader();
    const [showSearchSuggestions, setShowSearchSuggestions] = useState(true);
    const [searchKeywords, setSearchKeywords] = useState<SearchKeyword[]>([]);
    const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
    const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
    const [ getTrendingMovies, {isSuccess: isGetTrendingMoviesSuccess, data: trendingMoviesData} ] = useLazyMovieTrendingQuery();
    const [getSearchKeywords, {isSuccess: isGetSearchKeywordsSuccess, data: searchKeywordsData}] = useLazyGetKeywordQuery();
    const {data: popularMovesData, isSuccess: isGetPopularSuccess} = usePopularMoviesQuery();
    const {data: nowPlayingData, isSuccess: isGetNowPlayingSuccess} = useNowPlayingQuery();

    useEffect(() => {
        if(!isTrendingLoading) {
            setIsTrendingLoading(true);
        }
        getTrendingMovies({trendingType: {mediaType: MovieMediaType.MOVIE, duration: trendingDuration}});
    }, [trendingDuration]);

    useEffect(() => {
        if(isGetTrendingMoviesSuccess) {
            setTrendingMovies(trendingMoviesData.data?.results!);
            setIsTrendingLoading(false);
        }
        completeTopBar();
    }, [isGetTrendingMoviesSuccess, trendingMoviesData]);

    useEffect(() => {
      if(isGetSearchKeywordsSuccess) {
        const searchKeywords = searchKeywordsData.data?.results;
        setSearchKeywords(searchKeywords!.slice(0, 9));
      }
    }, [isGetSearchKeywordsSuccess, searchKeywordsData]);

    useEffect(() => {
      if(!isGetPopularSuccess) {
        return;
      }
      setPopularMovies(popularMovesData.data?.results!)
    }, [isGetPopularSuccess, popularMovesData]);

    useEffect(() => {
      if(!isGetNowPlayingSuccess) {
        return;
      }
      setNowPlayingMovies(nowPlayingData.data?.results!)
    }, [isGetNowPlayingSuccess, nowPlayingData]);

    const onLeftDurationClick = () => {
      startTopBar();
      setTrendingDuration(MovieTrendingDuration.DAY);
    };

    const onPopularTrailerClick = async () => {
      startTopBar();
      await delay(400);
      setTrailerType(MovieTrailerType.POPULAR);
      completeTopBar();
  };

    const onRightDurationClick = () => {
        startTopBar();
        setTrendingDuration(MovieTrendingDuration.WEEK);
    };

    const onInTheaterClick = async () => {
      startTopBar();
      await delay(400);
      setTrailerType(MovieTrailerType.IN_THEATER);
      completeTopBar();
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/movie/search?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    }

    const onMovieCardClick = (id: string)=>{
        navigate('/movie/' + id);
        return;
    }

    const onSearchInputChange: ChangeEventHandler = (event : ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      setSearchQuery(query);
      if(query.trim().length > 0) {
        getSearchKeywords({query});
      } else {
        setSearchKeywords([]);
      }
    };

    const onSearchInputFocus = () => {
      setShowSearchSuggestions(true);
    };

    const onSearchInputBlur = () => {
      setTimeout(() => {
        setShowSearchSuggestions(false);
      }, 200);
    };

    const onSearchSuggestionClick = (keyword: string) => {
      setSearchQuery(keyword);
      navigate(`/movie/search?query=${encodeURIComponent(keyword.trim())}`)
    };

    return (
      <div className="w-full">
        <Helmet>
          <title>Homepage</title>
        </Helmet>
        <section className="px-8 flex justify-center w-full bg-discover-bg bg-no-repeat py-8 bg-black bg-center relative bg-cover">
          <div className="absolute inset-0 bg-black opacity-35 z-10"></div>
          <div className="max-w-[1300px] z-20">
            <h3 className="text-4xl font-semibold text-white">
              Welcome to TMDB
            </h3>
            <p className="text-2xl font-medium mt-2 text-white">
              Millions of movies, TV shows and people to discover. Explore now.
            </p>

            <div className="relative">
              <Input
                className={`rounded-full py-6 px-6 mt-8`}
                placeholder="Search for a movie, tv show, person"
                onChange={onSearchInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                onFocus={onSearchInputFocus}
                onBlur={onSearchInputBlur}
                value={searchQuery}
              />
              <Search
                className="text-primary cursor-pointer absolute top-3 end-5"
                onClick={handleSearch}
              />

              {searchKeywords.length > 0 && (
                <div
                  className={`absolute bg-no-repeat bg-background/85 w-full top-[110%] px-4 py-4 rounded-2xl border ${
                    !showSearchSuggestions ? "hidden" : ""
                  }`}
                >
                  <ul>
                    {searchKeywords.map((keyword) => (
                      <li
                        key={keyword.id}
                        className="w-full px-4 py-2 cursor-pointer hover:bg-primary/30 hover:transform hover:scale-105 duration-200 rounded-xl"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          onSearchSuggestionClick(keyword.name);
                        }}
                      >
                        {keyword.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="px-8 mt-8 w-full flex justify-center flex-col gap-8 items-center">
          <div className="max-w-[1300px] w-full">
            <div className="flex sm:flex-row sm:items-center sm:space-x-4 flex-col justify-start space-y-2">
              <h4 className="text-lg">Trending</h4>
              <SliderButton
                onLeftClick={onLeftDurationClick}
                onRightClick={onRightDurationClick}
                leftLabel="Today"
                rightLabel="This week"
              />
            </div>
            <ScrollArea className="w-full">
              <div className="flex gap-4 py-6">
                {isTrendingLoading &&
                  new Array(10).fill(null).map((_, idx) => {
                    return <MovieCardSkeleton key={idx} />;
                  })}
                {trendingMovies.map((movie) => {
                  return (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onClick={() => onMovieCardClick(movie.id.toString())}
                    />
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <div className="max-w-[1300px] w-full">
            <div className="flex sm:flex-row sm:items-center sm:space-x-4 flex-col justify-start space-y-2">
              <h4 className="text-lg">Latest Trailers</h4>
              <SliderButton
                onLeftClick={onPopularTrailerClick}
                onRightClick={onInTheaterClick}
                leftLabel="Popular"
                rightLabel="In theater"
              />
            </div>
            <ScrollArea className="w-full">
              <div className="flex gap-4 py-6">
                {isTrendingLoading &&
                  new Array(10).fill(null).map((_, idx) => {
                    return <MovieCardSkeleton key={idx} />;
                  })}
                {(trailerType == MovieTrailerType.POPULAR
                  ? popularMovies
                  : nowPlayingMovies
                ).map((movie) => {
                  return <TrailerCard key={movie.id} movie={movie} />;
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <div className="max-w-[1300px] w-full">
            <div className="flex">
              <h4 className="text-lg">What's popular</h4>
            </div>
            <ScrollArea className="w-full">
              <div className="flex gap-4 py-6">
                {isTrendingLoading &&
                  new Array(10).fill(null).map((_, idx) => {
                    return <MovieCardSkeleton key={idx} />;
                  })}
                {popularMovies.map((movie) => {
                  return (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onClick={() => onMovieCardClick(movie.id.toString())}
                    />
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </section>
      </div>
    );
};

export default Homepage;