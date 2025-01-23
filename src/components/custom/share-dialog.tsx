import { Copy } from "react-bootstrap-icons"
 
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ReactNode, useEffect, useState } from "react"
import CopyToClipboard from "react-copy-to-clipboard"

export type ShareDialogProps = {
    children?: ReactNode;
    value: string;
    open: boolean;
    setOpen: (val: boolean) => void;
};
 
export function ShareDialog(props: ShareDialogProps) {
    const {children, value, open, setOpen} = props;

    const [isCopied, setIsCopied] = useState(false);
    
    useEffect(() => {
        if(isCopied) {
            setTimeout(() => {
                setIsCopied(false);
            }, 1000);
        };
    }, [isCopied, setIsCopied]);

    const onCopy = () => {
        setIsCopied(true);
    }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              value={value}
              readOnly
            />
          </div>
          <CopyToClipboard text={value} onCopy={onCopy}>
            <Button type="submit" size="sm" className="px-3">
                <span className="sr-only">Copy</span>
                {
                    isCopied 
                    ? <p>Copied</p>
                    : <Copy />
                }
            </Button>
          </CopyToClipboard>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}