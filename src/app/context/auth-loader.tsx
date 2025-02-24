import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentAuthentication,
  setAuthenticatedUser,
} from "../api/auth/auth-slice";
import { useGetAuthenticationQuery } from "../api/user/user.api.slice";
import { User } from "../api/types/user.type";
import { FallbackScreen } from "@/components/custom/fallback-screen";
import { setLikedMovies, setWatchLater } from "../api/movies/movie-list-slice";
import {
  useLazyGetLikedMoviesQuery,
  useLazyGetWatchLaterListQuery,
} from "../api/movies/movie-api-slice";
import { useLazyGetPlaylistsQuery } from "../api/playlist/playlist-api-slice";
import { addPlayList } from "../api/playlist/playlist-slice";

type AuthLoaderProps = {
  children: ReactNode;
};

export const AuthLoader = ({ children }: AuthLoaderProps) => {
  const dispatch = useDispatch();
  const authData = useSelector(getCurrentAuthentication);

  const accessToken = localStorage.getItem("access_token");
  const { data, isSuccess, isLoading, isError } = useGetAuthenticationQuery(
    undefined,
    {
      skip: !accessToken,
    }
  );

  const [
    getLikedMovies,
    { isSuccess: isGetLikedMovieSuccess, data: likedMovies },
  ] = useLazyGetLikedMoviesQuery();
  const [
    getWatchLaterList,
    { isSuccess: isGetWatchLaterSuccess, data: watchLaterData },
  ] = useLazyGetWatchLaterListQuery();
  const [getPlaylist, { isSuccess: isGetPlaylistSuccess, data: playlistData }] =
    useLazyGetPlaylistsQuery();

  useEffect(() => {
    if (!authData) return;
    getLikedMovies();
    getWatchLaterList();
    getPlaylist();
  }, [authData, getLikedMovies, getWatchLaterList, getPlaylist]);

  useEffect(() => {
    if (!isGetLikedMovieSuccess) return;
    dispatch(setLikedMovies(likedMovies.data!));
  }, [isGetLikedMovieSuccess, likedMovies, dispatch]);

  useEffect(() => {
    if (!isGetWatchLaterSuccess) return;
    dispatch(setWatchLater(watchLaterData.data!));
  }, [isGetWatchLaterSuccess, watchLaterData, dispatch]);

  useEffect(() => {
    if (!isGetPlaylistSuccess) return;
    dispatch(addPlayList(playlistData.data!));
  }, [isGetPlaylistSuccess, playlistData, dispatch]);

  useEffect(() => {
    if (data) {
      dispatch(setAuthenticatedUser(data?.data as User));
    }
  }, [data, dispatch]);

  return (
    <>
      {isLoading && <FallbackScreen />}
      {(!accessToken || isSuccess || isError) && children}
    </>
  );
};
