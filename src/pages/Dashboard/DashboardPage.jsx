import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import axios from "axios";
import { Loader } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useToast } from "../../hooks/use-toast";

export function Dashboard({ user }) {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const stats = useMemo(() => {
    const total = applications.length;
    const active = applications.filter(
      (app) => app.status !== "Rejected"
    ).length;
    const interviews = applications.filter(
      (app) => app.status === "Interview"
    ).length;
    const offers = applications.filter((app) => app.status === "Offer").length;
    const rejected = applications.filter(
      (app) => app.status === "Rejected"
    ).length;
    const successRate = total > 0 ? Math.round((offers / total) * 100) : 0;
    const interviewRate =
      total > 0 ? Math.round((interviews / total) * 100) : 0;

    return {
      total,
      active,
      interviews,
      offers,
      rejected,
      successRate,
      interviewRate,
    };
  }, [applications]);

  const statusData = useMemo(() => {
    const statusCounts = {
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    };

    applications.forEach((app) => {
      if (app.status in statusCounts) {
        statusCounts[app.status]++;
      }
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));
  }, [applications]);

  // Prepare data for timeline chart (applications per week)
  const timelineData = useMemo(() => {
    if (applications.length === 0) return [];

    try {
      // Sort applications by date
      [...applications].sort((a, b) => {
        return new Date(a.date_applied) - new Date(b.date_applied);
      });

      // Simple weekly data - just count by month/day
      const dateGroups = {};

      applications.forEach((app) => {
        const date = new Date(app.date_applied);
        const monthDay = `${date.toLocaleString("default", {
          month: "short",
        })} ${date.getDate()}`;

        if (!dateGroups[monthDay]) {
          dateGroups[monthDay] = 0;
        }
        dateGroups[monthDay]++;
      });

      return Object.keys(dateGroups).map((date) => ({
        date,
        count: dateGroups[date],
      }));
    } catch (error) {
      console.error("Error creating timeline data:", error);
      return [];
    }
  }, [applications]);

  // Prepare data for company breakdown
  const companyData = useMemo(() => {
    if (applications.length === 0) return [];

    const companies = {};

    applications.forEach((app) => {
      if (app.company) {
        companies[app.company] = (companies[app.company] || 0) + 1;
      }
    });

    return Object.entries(companies)
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 companies
  }, [applications]);

  // Prepare data for position type breakdown
  const positionData = useMemo(() => {
    if (applications.length === 0) return [];

    const positions = {};

    applications.forEach((app) => {
      if (app.position) {
        // Extract role type (e.g., "Developer" from "Frontend Developer")
        const words = app.position.split(" ");
        const roleType =
          words.length > 1 ? words[words.length - 1] : app.position;
        positions[roleType] = (positions[roleType] || 0) + 1;
      }
    });

    return Object.entries(positions)
      .map(([position, count]) => ({ position, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 position types
  }, [applications]);

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

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

  // Log data for debugging
  useEffect(() => {
    console.log("Applications:", applications);
    console.log("Status Data:", statusData);
    console.log("Timeline Data:", timelineData);
    console.log("Company Data:", companyData);
    console.log("Position Data:", positionData);
  }, [applications, statusData, timelineData, companyData, positionData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.active} active applications
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Interview Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.interviewRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.interviews} interviews from {stats.total} applications
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.offers} offers from {stats.total} applications
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Rejection Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total > 0
                ? Math.round((stats.rejected / stats.total) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.rejected} rejections from {stats.total} applications
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>
              Distribution of applications by status
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} applications`, "Count"]}
                  />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                    name="Applications"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Timeline</CardTitle>
            <CardDescription>Number of applications over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} applications`, "Count"]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="Applications"
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Companies</CardTitle>
            <CardDescription>Companies you've applied to most</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companyData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="company" type="category" width={100} />
                  <Tooltip
                    formatter={(value) => [`${value} applications`, "Count"]}
                  />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#ff7300"
                    radius={[0, 4, 4, 0]}
                    name="Applications"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Position Types</CardTitle>
            <CardDescription>Distribution by position type</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(value, name) => [`${value} applications`, name]}
                  />
                  <Legend />
                  <Pie
                    data={positionData}
                    dataKey="count"
                    nameKey="position"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ position }) => position}
                  >
                    {positionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
