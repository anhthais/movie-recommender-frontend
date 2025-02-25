import { createBrowserRouter, Navigate, Outlet, useLocation } from "react-router-dom";
import { getCurrentAuthentication } from "../app/api/auth/auth-slice";
import { useSelector } from "react-redux";
import { AuthLayout } from "@/layouts/auth-layout";
import { MainLayout } from "@/layouts/main-layout";
import { lazy, Suspense } from "react";
import { FallbackScreen } from "@/components/custom/fallback-screen";
import NotFoundPage from "@/pages/error/not-found-page";
import { PlaylistDetailsPage } from "@/pages/playlist/playlist-details-page";
import { ActivateAccountPage } from "@/pages/auth/activate-account-page";
import CastDetail from "@/pages/person/person-detail.tsx";

const MovieListPage = lazy(() => import("../pages/movie/movie-list-page.tsx"));
const RegisterPageLazy = lazy(() => import("../pages/auth/register-page"));
const PlaylistPageLazy = lazy(() => import("../pages/playlist/playlist-page.tsx"));
const MovieDetailPageLazy = lazy(() => import("../pages/movie/movie-detail"));
const LikedMoviesPageLazy = lazy(() => import("../pages/playlist/liked-movies-page.tsx"));
const WatchListPageLazy = lazy(() => import("../pages/playlist/watch-list-page.tsx"));
const SearchPageLazy = lazy(() => import("../pages/search/search-page"));
const ReviewListPageLazy = lazy(() => import("../pages/reviews/review-list-page"));
const RatingListPageLazy = lazy(() => import("../pages/playlist/rating-list-page.tsx"));
const HomePageLazy = lazy(() => import("../pages/home/home-page.tsx"));
const ReviewHomePageLazy = lazy(() => import("../pages/reviews/review-home-page.tsx"));
const PickAMoviePageLazy = lazy(() => import("../pages/pick-a-movie/pick-a-movie-page.tsx"));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector(getCurrentAuthentication);
  const location = useLocation();

  return user 
    ? ( children) 
    : (
    <Navigate
      to={`/login?redirectTo=${encodeURIComponent(location.pathname)}`}
      replace
    />
  );
};

export const router = createBrowserRouter([
  {
    path: "/person",
    element: (
      <Suspense fallback={<FallbackScreen />}>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </Suspense>
    ),
    children: [
      
      {
        path: ":person_id",
        element: (
          <Suspense fallback={<FallbackScreen />}>
            <CastDetail/>
          </Suspense>
        ),
      },
      {
        path: "",
        element: (
          <Suspense fallback={<FallbackScreen />}>
            {/* <MovieListPage /> */}
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/movie",
    element: (
      <Suspense fallback={<FallbackScreen />}>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </Suspense>
    ),
    children: [
      {
        path: "search",
        element: (
          <Suspense fallback={<FallbackScreen />}>
            <SearchPageLazy />
          </Suspense>
        ),
      },
      {
        path: ":id",
        element: (
          <Suspense fallback={<FallbackScreen />}>
            <MovieDetailPageLazy />
          </Suspense>
        ),
      },
      {
        path: ":id/reviews",
        element: (
          <Suspense fallback={<FallbackScreen />}>
            <ReviewListPageLazy />
          </Suspense>
        ),
      },
      {
        path: "",
        element: (
          <Suspense fallback={<FallbackScreen />}>
            <MovieListPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/login",
    lazy: async () => {
      const { default: LoginPage } = await import("../pages/auth/login-page");
      return {
        element: (
          <Suspense fallback={<FallbackScreen />}>
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          </Suspense>
        ),
      };
    },
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<FallbackScreen />}>
        <RegisterPageLazy />
      </Suspense>
    ),
  },
  {
    path: "/reset-password",
    lazy: async () => {
      const { default: ResetPasswordPage } = await import(
        "../pages/auth/reset-password-page.tsx"
      );
      return {
        element: (
          <Suspense fallback={<FallbackScreen />}>
            <AuthLayout>
              <ResetPasswordPage />
            </AuthLayout>
          </Suspense>
        ),
      };
    },
  },
  {
    path: "/reviews",
    element: (
      <Suspense fallback={<FallbackScreen />}>
        <MainLayout>
          <ReviewHomePageLazy />
        </MainLayout>
      </Suspense>
    )
  },
  {
    path: "pick-a-movie",
    element: (
      <Suspense fallback={<FallbackScreen />}>
        <MainLayout>
          <PickAMoviePageLazy />
        </MainLayout>
      </Suspense>
    )
  },
  {
    path: "",
    element: (
    <Suspense fallback={<FallbackScreen />}>
      <MainLayout>
        <HomePageLazy />
      </MainLayout>
    </Suspense>)
  },
  {
    path: "",
    element: (
      <Suspense fallback={<FallbackScreen />}>
        <ProtectedRoute>
          <MainLayout>
            <Outlet />
          </MainLayout>
        </ProtectedRoute>
      </Suspense>
    ),
    children: [
      {
        path: "/playlists",
        element: (
          <Suspense fallback={<FallbackScreen />}>
            <PlaylistPageLazy />
          </Suspense>
        ),
      },
      {
        path: "/playlists/:playlistId",
        element: <PlaylistDetailsPage />,
      },
      {
        path: "/like-list",
        element: <LikedMoviesPageLazy />,
      },
      {
        path: "/watch-list",
        element: <WatchListPageLazy />,
      },
      {
        path: "/ratings",
        element: <RatingListPageLazy />
      }
    ],
  },
  {
    path: "/activate-account",
    element: <ActivateAccountPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
