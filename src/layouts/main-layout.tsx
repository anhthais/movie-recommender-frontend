import { useLazyGetKeywordQuery } from "@/app/api/movies/movie-api-slice";
import { SearchKeyword } from "@/app/api/types/movie.type";
import Chatbot from "@/components/custom/chat-bot";
import Footer from "@/components/custom/footer";
import { UserPopover } from "@/components/custom/user-popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useAuthentication } from "@/hooks/use-authentication"
import { useSmallScreen } from "@/hooks/use-small-screen";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Search } from "lucide-react";
import { ChangeEvent, ChangeEventHandler, FormEvent, useEffect, useState } from "react";
import { BoxArrowRight, List, XLg } from "react-bootstrap-icons";
import { Link, Navigate, useNavigate } from "react-router-dom";

const SMALL_BREAKPOINT = 768;

export type AuthLayoutProps = {
    children: React.ReactNode,
}

export const MainLayout = ({ children}: AuthLayoutProps) => {
  const { isAuthenticated, authentication } = useAuthentication();
  const isSmallScreen = useSmallScreen();
  const [searchQuery, setSearchQuery] = useState("");
  const [openUserPopover, setOpenUserPopover] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOverlaySearchOpen, setIsOverlaySearchOpen] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(true);
  const [searchKeywords, setSearchKeywords] = useState<SearchKeyword[]>([]);
  const [getSearchKeywords, { isSuccess: isGetSearchKeywordsSuccess, data: searchKeywordsData }] = useLazyGetKeywordQuery();
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/movie/search?query=${searchQuery}`);
    }
  };

  const handleSearchInputChange: ChangeEventHandler = (event : ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    if(query.trim().length > 0) {
      getSearchKeywords({query});
    } else {
      setSearchKeywords([]);
    }
  };
  
  const handleSearchInputFocus = () => {
    setShowSearchSuggestions(true);
  };

  const handleSearchInputBlur = () => {
    setTimeout(() => {
      setShowSearchSuggestions(false);
    }, 200);
  };

  const handleSearchSuggestionClick = (keyword: string) => {
    setSearchQuery(keyword);
    navigate(`/movie/search?query=${encodeURIComponent(keyword.trim())}`)
  };

  useEffect(() => {
    if (isGetSearchKeywordsSuccess) {
      const searchKeywords = searchKeywordsData.data?.results;
      setSearchKeywords(searchKeywords!.slice(0, 9));
    }
  }, [isGetSearchKeywordsSuccess, searchKeywordsData]);

  return (
    <>
      {authentication && !authentication.activated ? (
        <Navigate
          to={`/activate-account?redirectTo=${encodeURIComponent(
            location.pathname
          )}`}
        />
      ) : (
        <div className="min-h-screen">
          <header className="w-full border-b py-4 sticky top-0 bg-background/80 z-50">
            <div className="flex w-full justify-between items-center px-6">
              {!isSmallScreen ? (
                <nav className="flex flex-row items-center space-x-6">
                  <Link to={"/"}>
                    <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-900 drop-shadow-lg hover:text-key transition-all duration-200">
                      <span className="tracking-tight">TMDB2</span>
                    </div>
                  </Link>
                  <Link to={"/movie"}>
                    <p className="font-semibold hover:text-key relative group pt-1 pb-1">
                      Movies
                      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-key transition-all duration-300 group-hover:w-full"></span>
                    </p>
                  </Link>
                  <Link to={"/"}>
                    <p className="font-semibold hover:text-key relative group pt-1 pb-1">
                      Pick a movie
                      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-key transition-all duration-300 group-hover:w-full"></span>
                    </p>
                  </Link>
                </nav>
              ) : (
                <nav className="flex flex-row items-center space-x-2">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-2xl text-key focus:outline-none"
                  >
                    <List />
                  </button>
                  <Link to={"/"}>
                    <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-900 drop-shadow-lg hover:text-key transition-all duration-200">
                      <span className="tracking-tight">TMDB2</span>
                    </div>
                  </Link>
                </nav>
              )}
              <div className="flex items-center gap-x-2">
                {!isSmallScreen ? (
                  <div className="relative">
                    <Input
                      className="rounded-full px-8 border-muted"
                      placeholder="Search movies..."
                      onChange={handleSearchInputChange}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                      onFocus={handleSearchInputFocus}
                      onBlur={handleSearchInputBlur}
                      value={searchQuery}
                    />
                    <Search
                      className="text-primary cursor-pointer absolute top-2 right-3 end-5"
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
                              className="w-full px-4 py-2 cursor-pointer hover:bg-primary/20 hover:transform hover:scale-105 duration-200 rounded-xl"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleSearchSuggestionClick(keyword.name);
                              }}
                            >
                              {keyword.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Search
                      className="text-primary cursor-pointer"
                      onClick={() =>
                        setIsOverlaySearchOpen(!isOverlaySearchOpen)
                      }
                    />
                    <div
                      className={`fixed inset-0 p-4 h-16 bg-background/90 z-50 flex flex-col items-center justify-start transform transition-transform duration-300 ease-out ${
                        isOverlaySearchOpen
                          ? "translate-y-0"
                          : "-translate-y-full opacity-0 pointer-events-none"
                      }`}
                    >
                      <div className="w-full relative">
                        <Input
                          className="flex-grow w-full rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-none border-none"
                          placeholder="Search movies..."
                          onChange={handleSearchInputChange}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSearch(e)
                          }
                          onFocus={handleSearchInputFocus}
                          onBlur={handleSearchInputBlur}
                          value={searchQuery}
                        />
                        <button
                          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-2xl text-primary font-bold hover:text-key"
                          onClick={() => setIsOverlaySearchOpen(false)}
                        >
                          <XLg />
                        </button>
                      </div>
                      {showSearchSuggestions &&
                        searchQuery &&
                        searchKeywords.length > 0 && (
                          <ul className="w-full px-4 bg-background/85 rounded-xl border">
                            {searchKeywords.map((keyword) => (
                              <li
                                key={keyword.id}
                                className="w-full px-4 py-2 cursor-pointer hover:bg-primary/20 hover:transform hover:scale-105 duration-200 rounded-xl"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleSearchSuggestionClick(keyword.name);
                                  setIsOverlaySearchOpen(false);
                                }}
                              >
                                {keyword.name}
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  </>
                )}
                <ModeToggle />
                {isAuthenticated && (
                  <UserPopover
                    open={openUserPopover}
                    onOpenChange={setOpenUserPopover}
                    closePopover={() => setOpenUserPopover(false)}
                  >
                    <div className="border size-10 rounded-full flex justify-center items-center cursor-pointer shrink-0">
                      <Avatar className="shrink-0">
                        <AvatarImage
                          src={authentication?.picture}
                          className="size-10 rounded-full shrink-0"
                        />
                        <AvatarFallback>
                          {authentication.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </UserPopover>
                )}
                {!isAuthenticated && (
                  <div className="flex space-x-2">
                    <Link to={"/login"}>
                      <Button size="sm" className="font-semibold rounded-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" className="hidden lg:block">
                      <Button size="sm" className="font-semibold rounded-full">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </header>
          {isSmallScreen && (
            <>
              <div
                className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${
                  sidebarOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setSidebarOpen(false)}
              ></div>
              <div
                className={`fixed top-0 left-0 h-full min-w-64 bg-background/85 shadow-lg z-50 transform overflow-y-auto ${
                  sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300`}
              >
                <div className="flex flex-col h-full p-4 pb-8 space-y-6 justify-between">
                  <div className="flex flex-col space-y-6">
                    <div className="flex flex-row items-center justify-between">
                      <Link to={"/"}>
                        <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-900 drop-shadow-lg hover:text-key transition-all duration-200">
                          <span className="tracking-tight">TMDB2</span>
                        </div>
                      </Link>
                      <div
                        className="font-semibold text-2xl hover:cursor-pointer hover:text-key"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <XLg />
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Link
                        to={"/movie"}
                        className="py-2 font-semibold hover:text-key"
                      >
                        Movies
                      </Link>
                      <Link
                        to={"/"}
                        className="py-2 font-semibold hover:text-key"
                      >
                        Pick a movie
                      </Link>
                    </div>
                  </div>
                  {isAuthenticated ?? (
                    <div className="flex space-x-4 items-center hover:cursor-pointer hover:text-key font-semibold">
                      <BoxArrowRight className="size-5" />
                      <span>Logout</span>
                    </div>
                  )}
                  {!isAuthenticated && (
                    <div className="flex flex-col space-y-4">
                      <Link to={"/login"}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="font-semibold rounded-full w-full hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                        >
                          Login
                        </Button>
                      </Link>
                      <Link to="/register">
                        <Button
                          variant="outline"
                          size="sm"
                          className="font-semibold rounded-full w-full hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                        >
                          Register
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          {children}
          <Chatbot />
          <Footer />
        </div>
      )}
    </>
  );
} 