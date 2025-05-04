import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableApplicationCard } from "./sortable-application-card";

export function ApplicationColumn({
  status,
  applications,
  onDelete,
  onUpdate,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status}`,
  });

  const statusColors = {
    Applied: "bg-blue-500",
    Interview: "bg-yellow-500",
    Offer: "bg-green-500",
    Rejected: "bg-red-500",
  };

  return (
    <div
      ref={setNodeRef}
      className={`bg-muted/40 rounded-lg p-4 h-full min-h-[500px] ${
        isOver ? "ring-2 ring-primary ring-inset" : ""
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
        <h2 className="font-semibold text-lg">{status}</h2>
        <span className="text-muted-foreground text-sm ml-auto">
          {applications.length}
        </span>
      </div>
      <SortableContext
        items={applications.map((app) => app.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {applications.map((application) => (
            <SortableApplicationCard
              key={application.id}
              application={application}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
