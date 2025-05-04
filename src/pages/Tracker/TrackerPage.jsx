import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Loader, PlusCircle } from "lucide-react";

import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { ApplicationCard } from "../../components/application-card";
import { ApplicationColumn } from "../../components/application-column";
import { ApplicationForm } from "../../components/application-form";
import axios from "axios";
import { useToast } from "../../hooks/use-toast";

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

export default function JobTracker({ user }) {
  const [applications, setApplications] = useState([
    {
      id: "1",
      company: "Acme Inc",
      position: "Frontend Developer",
      dateApplied: "2023-05-01",
      status: "Applied",
      notes: "Applied through company website",
      job_link: "https://acme.com",
    },
    {
      id: "2",
      company: "TechCorp",
      position: "Full Stack Engineer",
      dateApplied: "2023-05-03",
      status: "Interview",
      notes: "First interview scheduled for next week",
      job_link: "https://techcorp.com",
    },
    {
      id: "3",
      company: "DevStartup",
      position: "React Developer",
      dateApplied: "2023-04-28",
      status: "Rejected",
      notes: "Position was filled internally",
      job_link: "",
    },
    {
      id: "4",
      company: "BigTech",
      position: "Software Engineer",
      dateApplied: "2023-05-05",
      status: "Applied",
      notes: "Referred by a friend",
      job_link: "https://bigtech.com",
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const getAllApplications = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/job?user_id=${user.user_id}`
        );
        console.log("Fetched applications:", response.data);
        setApplications(response.data.payload);
        toast({
          title: "Fetched all applications successfully!",
          description: "You can now manage your applications.",
        });
      } catch (error) {
        console.error("Error fetching item:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.response.data.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    getAllApplications();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event) => {
    console.log("start :", event.active.id);
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeApp = applications.find((app) => app.id === active.id);
      if (!activeApp) return;

      // Jika drop ke kolom
      if (over.id.toString().startsWith("column-")) {
        const newStatus = over.id.toString().replace("column-", "");
        const updatedApp = { ...activeApp, status: newStatus };

        try {
          setApplications((prev) =>
            prev.map((app) => (app.id === activeApp.id ? updatedApp : app))
          );
          const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/job/${activeApp.id}`,
            updatedApp
          );
          console.log("Application updated:", response.data);
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.response.data.message,
          });
          console.error("Error updating status on drag:", error);
        }
      }
      // Jika drop ke card lain
      else {
        const overApp = applications.find((app) => app.id === over.id);
        if (!overApp) return;

        const updatedApp = { ...activeApp, status: overApp.status };

        try {
          setApplications((prev) =>
            prev.map((app) => (app.id === activeApp.id ? updatedApp : app))
          );
          const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/job/${activeApp.id}`,
            updatedApp
          );
          console.log("Application updated:", response.data);
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.response.data.message,
          });
          console.error("Error updating status on drag:", error);
        }
      }
    }

    setActiveId(null);
  };

  const handleAddApplication = async (application) => {
    const newApplication = {
      ...application,
    };
    console.log("New application:", newApplication);

    try {
      setIsLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/job`, {
        ...newApplication,
        user_id: user.user_id,
      });
      console.log("Application added:", response);
      setApplications([
        ...applications,
        { ...newApplication, id: response.data.payload.id },
      ]);
      toast({
        title: "Application added successfully!",
        description: "You can now manage your applications.",
      });
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error adding application:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteApplication = async (id) => {
    console.log("Deleting application with id:", id);
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/job/${id}`
      );
      console.log("Application deleted:", response.data);
      setApplications(applications.filter((app) => app.id !== id));
      toast({
        title: "Application deleted successfully!",
        description: "You can now manage your applications.",
      });
    } catch (error) {
      console.error("Error deleting application:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateApplication = async (updatedApp) => {
    try {
      console.log("Updating application:", updatedApp);
      setIsLoading(true);
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/job/${updatedApp.id}`,
        updatedApp
      );
      console.log("Application updated:", response.data);
      setApplications(
        applications.map((app) => (app.id === updatedApp.id ? updatedApp : app))
      );
      setIsFormOpen(false);
      toast({
        title: "Application updated successfully!",
        description: "You can now manage your applications.",
      });
    } catch (error) {
      console.error("Error updating application:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const activeApplication = applications.find((app) => app.id === activeId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex md:flex-row text-center flex-col gap-5 md:gap-0 justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Internship Application Tracker</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Application
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Application</DialogTitle>
            </DialogHeader>
            <ApplicationForm onSubmit={handleAddApplication} />
          </DialogContent>
        </Dialog>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATUSES.map((status) => (
            <ApplicationColumn
              key={status}
              status={status}
              applications={applications.filter((app) => app.status === status)}
              onDelete={handleDeleteApplication}
              onUpdate={handleUpdateApplication}
            />
          ))}
        </div>
        <DragOverlay>
          {activeId && activeApplication ? (
            <div className="w-full max-w-[350px]">
              <ApplicationCard
                application={activeApplication}
                onDelete={handleDeleteApplication}
                onUpdate={handleUpdateApplication}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
