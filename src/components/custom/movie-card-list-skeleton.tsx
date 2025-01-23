import { Skeleton } from "../ui/skeleton";

export const MovieCardListSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-md w-full h-32 md:h-40 shadow-lg bg-gray-rose-gradient flex">
      <Skeleton className="w-24 md:w-28 h-32 md:h-40" />
      <div className="flex flex-col w-full">
        <div className="flex flex-col w-full py-2 px-3 space-y-4">
          <Skeleton className="w-26 md:w-32 h-4 md:h-6" />
          <Skeleton className="w-12 md:w-16 h-2 md:h-4" />
          <Skeleton className="w-full h-8 md:h-10" />
        </div>
        <div className="flex flex-row space-x-4 m-3">
          <Skeleton className="w-16 md:w-20 h-1 md:h-3" />
          <Skeleton className="w-16 md:w-20 h-1 md:h-3" />
        </div>
      </div>
    </div>
  );
};
