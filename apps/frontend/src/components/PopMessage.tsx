import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";


export function PopMessage({ open, message, onClose }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader className="hidden">
          <DialogTitle>Message</DialogTitle>
        </DialogHeader>
        <DialogDescription>
        <p>{message}</p>
        <Button onClick={onClose} className="mt-4 w-full sm:w-auto">
          Close
        </Button>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
