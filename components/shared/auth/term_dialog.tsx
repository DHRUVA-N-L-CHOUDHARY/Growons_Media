import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import BadgeStatus from "@/app/(protected)/money/_components/BadgeStatus";

const TermDialog = ({
  reason,
  status,
}: {
  reason: string;
  status: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger>
        <BadgeStatus status={status} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reason :</DialogTitle>
          <DialogDescription>{reason}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default TermDialog;
