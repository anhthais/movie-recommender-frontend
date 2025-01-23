import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAddMovieReviewMutation, useDeleteMovieReviewMutation, useEditMovieReviewMutation, useLazyGetMovieReviewsQuery, useMovieDetailQuery } from "@/app/api/movies/movie-api-slice";
import { Movie, Review } from "@/app/api/types/movie.type";
import { useEffect, useState } from "react";
import { useTopBarLoader } from "@/hooks/use-top-loader";
import { Spinner } from "@/components/custom/spinner";
import { ReviewCard } from "@/components/custom/review-card";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getResourceFromTmdb } from "@/lib/helpers/get-resource-tmbd";
import EditorDialog from "@/components/custom/editor-dialog";
import dayjs from "dayjs";
import { toast } from "@/hooks/use-toast";
import DeleteModal from "@/components/custom/delete-modal";
import Pagination from "@/components/custom/pagination";
import { useSelector } from "react-redux";
import { RootState } from "@/app/api/store";

const ReviewListPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const movieId = id ? parseInt(id) : 0;
  const [searchParams] = useSearchParams();
  const pageFromParams = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : 1;
  const { staticStart: startTopBarLoader, complete: completeTopBarLoader } = useTopBarLoader();

  const [currentPage, setCurrentPage] = useState(pageFromParams);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.user);

  const [getReviews, { data: reviewData, isSuccess: isGetReviewsSuccess }] = useLazyGetMovieReviewsQuery();
  const { data: movieData, isSuccess: isGetMovieSuccess } = useMovieDetailQuery({id : movieId.toString()});
  const [movie, setMovie] = useState<Movie>();
  const [targetReview, setTargetReview] = useState<Review>();
  const [openAddReviewDialog, setOpenAddReviewDialog] = useState(false);
  const [openEditReviewDialog, setOpenEditReviewDialog] = useState(false);
  const [openDeleteReviewDialog, setOpenDeleteReviewDialog] = useState(false);
  const [addReview, {isSuccess: isAddReviewgSuccess, isError: isAddReviewError}] = useAddMovieReviewMutation();
  const [editReview, {isSuccess: isEditReviewSuccess, isError: isEditReviewError}] = useEditMovieReviewMutation();
  const [deleteReview, {isSuccess: isDeleteReviewSuccess, isError: isDeleteReviewError}] = useDeleteMovieReviewMutation();

  useEffect(() => {
    if (!isGetMovieSuccess) {
      return;
    }

    setMovie(movieData?.data);
  } , [isGetMovieSuccess, movieData]);

  useEffect(() => {
    if (!isLoading) {
      startTopBarLoader();
      setIsLoading(true);
    }

    getReviews({movieId, page: currentPage, limit: 10});
  }, [movieId, currentPage, getReviews]);

  useEffect(() => {
    if (isGetReviewsSuccess) {
      setReviews(reviewData.data?.reviews ? reviewData.data.reviews : []);
      setIsLoading(false);
      completeTopBarLoader();
    }

  }, [isGetReviewsSuccess, reviewData]);

  useEffect(() => {
    if (!isAddReviewError) {
      return;
    }
    toast({
      title: "Error",
      variant: "destructive",
      description: `Error when added review for ${movie?.title} 😰. ${!isAuthenticated ? "Please log in to use this feature." : ""}`,
    });
  });

  useEffect(() => {
    if (!isAddReviewgSuccess) {
      return;
    }
    getReviews({ movieId, page: currentPage, limit: 10 });
    setOpenAddReviewDialog(false);
    toast({
      title: "Success",
      description: `Added review for ${movie?.title}`,
    });
  }, [isAddReviewgSuccess]);

  useEffect(() => {
    if (!isEditReviewError) {
      return;
    }
    toast({
      title: "Error",
      variant: "destructive",
      description: `Error when edited review for ${movie?.title} 😰`,
    });
  });

  useEffect(() => {
    if (!isEditReviewSuccess) {
      return;
    }
    setOpenEditReviewDialog(false);
    getReviews({ movieId, page: currentPage, limit: 10 });
    toast({
      title: "Success",
      description: `Edited review for ${movie?.title}`,
    });
  }, [isEditReviewSuccess]);

  useEffect(() => {
    if (!isDeleteReviewError) {
      return;
    }
    toast({
      title: "Error",
      variant: "destructive",
      description: `Error when deleted review for ${movie?.title} 😰`,
    });
  });

  useEffect(() => {
    if (!isDeleteReviewSuccess) {
      return;
    }
    setOpenDeleteReviewDialog(false);
    getReviews({ movieId, page: currentPage, limit: 10 });
    toast({
      title: "Success",
      description: `Deleted review for ${movie?.title}`,
    });
  }, [isDeleteReviewSuccess]);

  const handleAddReview = (comment: string) => {
    addReview({
      movieId: movieId,
      content: comment,
    });

    getReviews({ movieId, page: currentPage, limit: 10 });
  };

  const handleEditReview = (reviewId: number, comment: string) => {
    editReview({
      reviewId,
      movieId: movieId,
      content: comment,
    });
  };

  const handleDeleteReview = (reviewId: number) => {
    deleteReview({ reviewId, movieId });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div
        className="relative h-[220px] bg-cover bg-center flex items-center bg-gray-900"
        {...(movie
          ? {
              style: {
                backgroundImage: `url(${getResourceFromTmdb(
                  movie.backdrop_path || movie.poster_path
                )})`,
              },
            }
          : {})}
      >
        <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-md"></div>
        <div className="relative z-10 max-w-[1200px] container mx-auto p-2 h-full flex flex-col justify-between items-start">
          <Button
            variant={"outline"}
            className="flex border-none justify-start space-x-2 text-white hover:text-rose-600 bg-transparent hover:bg-transparent"
            onClick={() => {
              navigate("/movie/" + movie?.id);
            }}
          >
            <ChevronLeft />
            <span>Back</span>
          </Button>
          <div className="flex items-center space-x-4">
            {movie ? (
              <img
                src={getResourceFromTmdb(movie.poster_path)}
                alt={movie.title}
                className="w-24 h-32 rounded-md shadow-lg"
              />
            ) : (
              <div className="w-24 h-32 bg-gray-900 rounded-md shadow-lg"></div>
            )}
            <div>
              <p
                className="text-lg font-semibold text-gray-300 hover:text-key hover:cursor-pointer"
                onClick={() => navigate("/movie/" + movie?.id)}
              >
                {movie?.title}
              </p>
              <p className="text-sm text-gray-300">
                Release: {dayjs(movie?.release_date).format("MMM DD YYYY")}
              </p>
              <h1 className="mt-3 text-3xl text-white font-semibold">User Reviews</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1200px] container mx-auto p-4">
        <div className="flex flex-row justify-between items-center my-2">
          <h3 className="text-xl font-bold mb-4">
            {isGetReviewsSuccess && reviewData && reviewData.data && (
              <span className="inline-flex items-center text-lg font-medium">
                Showing {reviewData.data.reviews.length} of{" "}
                {reviewData.data.total} reviews
              </span>
            )}
          </h3>
          <EditorDialog
            triggerElement={
              <Button className="rounded-full hover:bg-keysecondary hover:text-keysecondary-foreground transition duration-200 py-2 px-4">
                Add Review
              </Button>
            }
            open={openAddReviewDialog}
            onOpenChange={setOpenAddReviewDialog}
            onSave={handleAddReview}
          />
        </div>
        <div className="px-8 py-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner isOpening={isLoading} />
            </div>
          ) : reviews.length > 0 ? (
            <ul className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onEdit={() => {
                    setTargetReview(review);
                    setOpenEditReviewDialog(true);
                  }}
                  onDelete={() => {
                    setTargetReview(review);
                    setOpenDeleteReviewDialog(true);
                  }}
                />
              ))}
            </ul>
          ) : (
            <p className="flex item-center text-primary/80">
              There are no reviews that matched for this movie.
            </p>
          )}
        </div>
        {isGetReviewsSuccess &&
          reviewData?.data &&
          reviewData.data.reviews.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={reviewData.data?.total_pages!}
              onPageChange={handlePageChange}
            />
          )}
        <EditorDialog
          open={openEditReviewDialog}
          onOpenChange={setOpenEditReviewDialog}
          triggerElement={<></>}
          onSave={(content) => {
            if (targetReview) {
              handleEditReview(targetReview.id, content);
            }
          }}
          initialText={targetReview?.comment!}
        />
        <DeleteModal
          isOpen={openDeleteReviewDialog}
          onClose={() => setOpenDeleteReviewDialog(!openDeleteReviewDialog)}
          onDelete={() => {
            if (targetReview) {
              handleDeleteReview(targetReview.id);
            }
          }}
          content={`Are you sure you want to delete this review?`}
        />
      </div>
    </>
  );
};

export default ReviewListPage;
