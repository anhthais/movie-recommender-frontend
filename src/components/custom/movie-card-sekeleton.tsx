import { Skeleton } from "../ui/skeleton"

export const MovieCardSkeleton = ()  => {
    return (
      <div className="rounded-lg overflow-hidden cursor-pointer shrink-0">
        <Skeleton className="w-32 md:w-40 h-[13.5rem] md:h-[15rem]" />
        <div className="mt-2 flex flex-col">
          <Skeleton className="h-4 md:h-6 w-16 md:w-20" />
          <Skeleton className="h-3 md:h-5 mt-1 w-8 md:w-12" />
        </div>
      </div>
    );
}