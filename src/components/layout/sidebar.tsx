"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/lib/store";
import { useThemeStore } from "@/lib/theme";
import {
  ChevronDown,
  LayoutDashboard,
  Link2,
  LogOut,
  Mail,
  MessageSquare,
  Monitor,
  Moon,
  Palette,
  Sun,
  X,
  Sparkles,
  AlertTriangle,
  Users,
  Package,
  ChartNoAxesCombined,
  BarChart3,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Obwb Email Management",
    icon: Mail,
    children: [
      { name: "Emails", href: "/dashboard/Obwb/emails", icon: Mail },
      { name: "Conversations", href: "/dashboard/Obwb/conversations", icon: MessageSquare },
      { name: "AI Digest", href: "/dashboard/Obwb/ai-digest", icon: Sparkles },
      { name: "Follow-ups", href: "/dashboard/Obwb/follow-ups", icon: AlertTriangle },
      { name: "Connect Email", href: "/dashboard/Obwb/connect-email", icon: Link2 },
    ],
  },
  {
    name: "Optical",
    icon: ChartNoAxesCombined,
    children: [
      {
        name: "Branch Performance",
        href: "/dashboard/Optical/branch-performance",
        icon: BarChart3,
      },
      {
        name: "Customer Metrics",
        href: "/dashboard/Optical/customer-metrics",
        icon: Users,
      },
      {
        name: "Staff Performance",
        href: "/dashboard/Optical/staff-performance",
        icon: Users,
      },
      { name: "Inventory", href: "/dashboard/Optical/inventory", icon: Package },
    ]
  }
];


interface SidebarProps {
  onMobileClose?: () => void;
}

export function Sidebar({ onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, userInServices, logout } = useAuthStore();
  const { setTheme, theme } = useThemeStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const hasAccessToService = (serviceName: string) => {
    return userInServices?.some((u) => u.service === serviceName);
  };

  const router = useRouter();

  // Determine which logo to use based on theme (client-side only)
  const [logoSrc, setLogoSrc] = useState("/FinitX Logo T - dark.png"); // Default for SSR

  useEffect(() => {
    const isDarkMode =
      theme === "dark" ||
      (theme === "system" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setLogoSrc(
      isDarkMode ? "/FinitX Logo T - light 1.png" : "/FinitX Logo T - dark.png"
    );
  }, [theme]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleNavigationClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <div
      className={`flex flex-col h-screen bg-card border-r border-border transition-all duration-300 ease-out ${isCollapsed ? "w-16" : "w-64"
        }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        <div
          className={`transition-all duration-300 ease-out overflow-hidden flex items-center gap-2 ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
        >
          <Image
            src={logoSrc}
            alt="FinitX Logo"
            width={120}
            height={36}
            className="h-10 w-auto"
          />
        </div>
        <div className="flex items-center gap-2">
          {onMobileClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileClose}
              className="lg:hidden transition-all duration-200 hover:bg-muted hover:scale-105"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block transition-all duration-200 hover:bg-muted hover:scale-105"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ease-out ${isCollapsed ? "rotate-90" : "-rotate-90"
                }`}
            />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        <TooltipProvider>
          {navigation.map((item) => {
            const hasChildren = item.children && item.children.length > 0;

            // Determine service key for this group, for example:
            // you may want to map group names to service keys explicitly:
            const serviceKeyMap: Record<string, string> = {
              Obwb: "obwb",
              Optical: "optical",
              "Obwb Email Management": "obwb", // or adapt as needed
            };

            const serviceKey = serviceKeyMap[item.name] || null;
            const userHasAccess = serviceKey ? hasAccessToService(serviceKey) : true;

            if (hasChildren) {
              const isGroupOpen = openGroups[item.name];
              const isGroupActive = item.children.some((child) =>
                pathname.startsWith(child.href)
              );

              return (
                <div key={item.name} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.name)}
                    className={`flex items-center w-full px-2 py-2 text-sm font-semibold rounded-md transition hover:bg-muted ${isGroupActive ? "bg-cyan/10 text-cyan" : "text-muted-foreground"
                      }`}
                  >
                    {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.name}</span>

                        {/* Show warning icon if no access */}
                        {!userHasAccess && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>You do not have access to this service</p>
                            </TooltipContent>
                          </Tooltip>
                        )}

                        <ChevronDown
                          className={`h-4 w-4 transform transition-transform duration-200 ${isGroupOpen ? "rotate-0" : "-rotate-90"
                            }`}
                        />
                      </>
                    )}
                  </button>

                  {!isCollapsed && (
                    <div
                      className={`ml-4 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${isGroupOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                    >
                      <div className="space-y-1">
                        {item.children.map((child) => {
                          const isChildActive = pathname === child.href;

                          // You may want to check access per child too
                          // If you have a service name for each child, map similarly:
                          const childServiceKey = serviceKey; // or assign per child if needed
                          const childHasAccess = childServiceKey
                            ? hasAccessToService(childServiceKey)
                            : true;

                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              onClick={handleNavigationClick}
                              className={`flex items-center px-2 py-1 text-sm rounded-md transition hover:bg-muted ${isChildActive
                                  ? "bg-cyan/10 text-cyan"
                                  : "text-muted-foreground"
                                }`}
                            >
                              {child.icon && (
                                <child.icon className="mr-3 h-4 w-4 text-muted-foreground" />
                              )}
                              <span>{child.name}</span>

                              {/* Warning icon if no access */}
                              {!childHasAccess && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <AlertTriangle className="ml-auto h-4 w-4 text-red-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>You do not have access to this service</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            // Simple item
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href!}
                onClick={handleNavigationClick}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-out transform hover:scale-[1.02] ${isActive
                    ? "bg-cyan/10 text-cyan shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                {item.icon && (
                  <item.icon
                    className={`mr-3 h-5 w-5 transition-all duration-200 ${isCollapsed ? "mr-0" : ""
                      }`}
                  />
                )}
                <span
                  className={`transition-all duration-300 ease-out ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </TooltipProvider>
      </nav>


      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start p-2 h-auto transition-all duration-200 hover:bg-muted hover:scale-[1.02]"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 transition-transform duration-200 hover:scale-105">
                  <AvatarImage alt={user?.first_name} />
                  <AvatarFallback className="bg-cyan text-primary font-medium">
                    {user?.first_name ? getInitials(user.first_name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`transition-all duration-300 ease-out overflow-hidden ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    }`}
                >
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-foreground">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <Palette className="mr-2 h-4 w-4" />
                <span>Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => setTheme("light")}
                  className="cursor-pointer"
                >
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className="cursor-pointer"
                >
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("system")}
                  className="cursor-pointer"
                >
                  <Monitor className="mr-2 h-4 w-4" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

}
