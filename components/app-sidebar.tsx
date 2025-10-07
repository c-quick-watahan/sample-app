"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, MessageSquareText, FilePlus2 } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
export function AppSidebar() {
  const { data: session } = useSession();

  const menuItems = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Posts",
      url: "#",
      icon: MessageSquareText,
    },
    {
      title: "New Post",
      url: "#",
      icon: FilePlus2,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Bulletin Board</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {session
                ? menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                : ""}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {session ? (
          <div className="flex flex-col">
            <h4>{session?.user?.name}</h4>
            <Button onClick={() => signOut()}>Sign Out</Button>
          </div>
        ) : (
          <Button onClick={() => signIn()}>Sign in</Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
