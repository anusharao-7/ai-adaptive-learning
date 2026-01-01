import { Home, Brain, Target, Users, Map, Zap, BarChart3, Flame, BookOpen, AlertTriangle, Settings, WifiOff, Tag } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const mainNav = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'AI Tutor', url: '/ai-tutor', icon: Brain },
  { title: 'Practice', url: '/quiz', icon: Target },
  { title: 'Live Pods', url: '/pods', icon: Users },
];

const learningNav = [
  { title: 'Visual Reasoning', url: '/visual-sandbox', icon: Zap },
  { title: 'Roadmap', url: '/roadmap', icon: Map },
  { title: 'Mock Tests', url: '/mock-tests', icon: BookOpen },
  { title: 'Weakness Drill', url: '/weakness-drills', icon: Flame },
];

const analyticsNav = [
  { title: 'Progress', url: '/progress', icon: BarChart3 },
  { title: 'Error Analysis', url: '/error-analysis', icon: AlertTriangle },
  { title: 'Question Tags', url: '/question-tagging', icon: Tag },
];

const systemNav = [
  { title: 'Offline Mode', url: '/offline', icon: WifiOff },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <div className="h-14 flex items-center px-4 border-b border-border/50">
        <SidebarTrigger />
        {!collapsed && (
          <span className="ml-3 font-bold text-gradient">Navodaya Prep</span>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="flex items-center gap-3 hover:bg-muted/50" activeClassName="bg-primary/10 text-primary font-medium">
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Learning</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {learningNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className="flex items-center gap-3 hover:bg-muted/50" activeClassName="bg-primary/10 text-primary font-medium">
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className="flex items-center gap-3 hover:bg-muted/50" activeClassName="bg-primary/10 text-primary font-medium">
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className="flex items-center gap-3 hover:bg-muted/50" activeClassName="bg-primary/10 text-primary font-medium">
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
