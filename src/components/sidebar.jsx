import {
  BarChart3,
  BriefcaseBusiness,
  Home,
  LogIn,
  LogOut,
  Settings,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../components/ui/sidebar";

export function AppSidebar({ user, onLogout }) {
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  const isDashboardActive = currentPath === "/dashboard";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="cursor-pointer transition-all duration-300 ease-in-out /50">
            <SidebarMenuButton size="lg" asChild tooltip="InternTracker">
              <div className="flex items-center">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform duration-300 ease-in-out ">
                  <BriefcaseBusiness className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none ml-2">
                  <span className="font-semibold">InternTracker</span>
                  <span className="text-xs text-muted-foreground">
                    Track your applications
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="cursor-pointer transition-all duration-300 ease-in-out /50">
                <SidebarMenuButton
                  asChild
                  isActive={currentPath === "/"}
                  tooltip="Applications"
                >
                  <a
                    href="/"
                    className="transition-colors duration-300 ease-in-out "
                  >
                    <Home className="mr-2 transition-transform duration-300 ease-in-out " />
                    <span>Applications</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="cursor-pointer transition-all duration-300 ease-in-out ">
                <SidebarMenuButton
                  asChild
                  isActive={isDashboardActive}
                  tooltip="Dashboard"
                >
                  <a
                    href="/dashboard"
                    className="transition-colors duration-300 ease-in-out "
                  >
                    <BarChart3 className="mr-2 transition-transform duration-300 ease-in-out " />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="cursor-pointer transition-all duration-300 ease-in-out">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton asChild tooltip="User Profile">
                        <div className="transition-all duration-300 ease-in-out ">
                          <Avatar className="h-6 w-6 mr-2 transition-transform duration-300 ease-in-out ">
                            <AvatarImage
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.username}
                            />
                            <AvatarFallback>
                              {user.username.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{user.username}</span>
                        </div>
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={onLogout}
                        className="transition-colors duration-300 ease-in-out "
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <a href="/login">
                    <SidebarMenuButton asChild tooltip="Log in">
                      <div className="transition-colors duration-300 ease-in-out ">
                        <LogIn className="mr-2 transition-transform duration-300 ease-in-out" />
                        <span>Log in</span>
                      </div>
                    </SidebarMenuButton>
                  </a>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
