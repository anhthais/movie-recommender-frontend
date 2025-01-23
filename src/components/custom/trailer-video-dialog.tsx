import { Video } from "@/app/api/types/movie.type"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"

export type TrailerVideoDialogProps = {
  video: Video;
  open: boolean;
  onOpenChange: (val: boolean) => void;
};

export const TrailerVideoDialog = (props: TrailerVideoDialogProps) => {
  const {video, open, onOpenChange} = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="xl:min-w-[1080px] lg:min-w-[840px] lg:min-h-[450px]">
        <DialogHeader>
          <DialogTitle>{video.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {
            video.site === 'YouTube' 
              ? <YouTubeEmbed videoId={video.key} />
              : undefined
          }
        </div>
      </DialogContent>
      </Dialog>
  )
}

const YouTubeEmbed = (props: {videoId: string}) => {
  const {videoId} = props;
  return (
    <div className="relative w-full pb-[56.25%]">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};