import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";

type DialogEditorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerElement: JSX.Element;
  onSave: (content: string) => void;
  initialText?: string;
};

const DialogEditor = ({
  open,
  onOpenChange,
  triggerElement,
  onSave,
  initialText = "",
}: DialogEditorProps) => {
  const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    if (open) {
      setEditorContent(initialText);
    }
  }, [open, initialText]);

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger>{triggerElement}</DialogTrigger>

        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
          <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background rounded-lg shadow-xl w-full max-w-2xl p-6">
            <DialogTitle className="text-lg font-bold">
              Text Editor
            </DialogTitle>
            <ReactQuill
              value={editorContent}
              onChange={setEditorContent}
              className="h-64"
            />
            <div className="flex justify-end mt-8 space-x-2">
              <Button
                variant={"secondary"}
                onClick={() => onOpenChange(false)}
                className="py-2 rounded-full"
              >
                Cancel
              </Button>
              <Button
                variant={"default"}
                onClick={() => {
                  onSave(editorContent);
                }}
                className="py-2 bg-rose-900 text-white rounded-full hover:bg-rose-700"
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
};

export default DialogEditor;
