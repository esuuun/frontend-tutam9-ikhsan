import { useState } from "react";
import { Calendar, ExternalLink, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { ApplicationForm } from "./application-form";

export function ApplicationCard({ application, onDelete, onUpdate }) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = () => {
    onDelete(application.id);
  };

  const handleUpdate = (updatedData) => {
    onUpdate({ ...updatedData, id: application.id });
    setIsEditOpen(false);
  };

  const timeAgo = formatDistanceToNow(new Date(application.date_applied), {
    addSuffix: true,
  });

  return (
    <>
      <Card className="shadow-sm hover:shadow transition-shadow">
        <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
          <div className="space-y-1">
            <h3 className="font-semibold text-base leading-tight">
              {application.position}
            </h3>
            <p className="text-sm text-muted-foreground">
              {application.company}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleDelete}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          {application.notes && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {application.notes}
            </p>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{timeAgo}</span>
          </div>
          {application.job_link && (
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a
                href={application.job_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Open job link</span>
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
          </DialogHeader>
          <ApplicationForm initialData={application} onSubmit={handleUpdate} />
        </DialogContent>
      </Dialog>
    </>
  );
}
