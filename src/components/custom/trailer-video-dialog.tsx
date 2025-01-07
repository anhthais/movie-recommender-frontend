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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{video.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
    <div className="video-responsive w-full px-2">
      <iframe
        width="100%"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};