import { useLayoutEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ChevronDoubleDown, ChevronDoubleUp } from "react-bootstrap-icons";
import { Review } from "@/app/api/types/movie.type";
import dayjs from "dayjs";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { Tooltip, TooltipContent } from "../ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { useSelector } from "react-redux";
import { RootState } from "@/app/api/store";

type ReviewCardProps = {
  review: Review;
  onEdit?: () => void;
  onDelete?: () => void;
};

export const ReviewCard = ({
  review: { user, comment, updated_at, created_at }, 
  onEdit,
  onDelete,
}: ReviewCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const defaultContentHeight = 120;
  const authUserId = useSelector((state: RootState) => state.auth.user?.id);
  const editable = authUserId === user.id;
  const isEdited = updated_at !== created_at;

  useLayoutEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [comment]);

  return (
    <div className="bg-gray-rose-gradient-light dark:bg-gray-rose-gradient rounded-xl shadow-xl p-4 pb-0 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
        <div className="flex items-center space-x-2">
          <Avatar className="shrink-0">
            <AvatarImage
              src={user.picture}
              className="size-10 rounded-full shrink-0"
            />
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center items-start mb-2">
            <div>
              <span className="font-semibold">{user.username}</span>{" "}
              <span className="font-light">
                {user.username != user.fullname ? `(${user.fullname})` : ""}
              </span>
            </div>
            <div className="font-light text-sm text-primary/80">
              {dayjs(created_at).format("MMM DD YYYY")}
              {!isEdited && (
                <> (Edited at {dayjs(updated_at).format("HH:MM MMM DD")})</>
              )}
            </div>
          </div>
        </div>
        {editable && (
          <div>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  className="bg-transparent text-primary hover:bg-primary hover:text-primary-foreground mr-2"
                  onClick={onEdit}
                >
                  <PencilSquare />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit your review</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  className="bg-transparent text-primary hover:bg-primary hover:text-primary-foreground mr-2"
                  onClick={onDelete}
                >
                  <Trash />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete your review</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between mb-2">
        <div
          className={`relative transition-[max-height] duration-200 ease-in-out overflow-hidden`}
          style={{
            maxHeight: isExpanded
              ? `${contentRef.current?.scrollHeight}px`
              : `${defaultContentHeight}px`,
          }}
          ref={contentRef}
        >
          <div className="flex flex-col mt-2 p-2 prose prose-invert">
            <article
              className="transition-all duration-100 text-primary/90"
              dangerouslySetInnerHTML={{ __html: comment }}
            ></article>
            {contentHeight > defaultContentHeight && !isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-200/50 dark:from-gray-900/50 to-transparent pointer-events-none"></div>
            )}
          </div>
        </div>

        {contentHeight > defaultContentHeight && (
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full border-none text-primary rounded-full bg-transparent hover:bg-transparent hover:text-key transition-all duration-200"
          >
            {isExpanded ? <ChevronDoubleUp /> : <ChevronDoubleDown />}
          </Button>
        )}
      </div>
    </div>
  );
};