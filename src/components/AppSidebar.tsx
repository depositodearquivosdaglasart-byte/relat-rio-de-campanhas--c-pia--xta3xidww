import { Link, useLocation } from 'react-router-dom'
import {
  BarChart2,
  Database,
  Plug,
  BrainCircuit,
  PieChart,
  History,
  Target,
  CalendarDays,
  Activity,
  BookOpen,
  LogOut,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar'
import { useAppContext } from '@/context/AppContext'

import { ShieldAlert } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

const navItems = [
  { title: 'Dashboard Diário', path: '/', icon: BarChart2 },
  { title: 'Relatórios', path: '/consolidated', icon: PieChart },
  { title: 'Base de Dados', path: '/database', icon: Database },
  { title: 'Painel Admin', path: '/admin', icon: ShieldAlert },
]

export function AppSidebar() {
  const location = useLocation()
  const { user, signOut } = useAuth()

  return (
    <Sidebar>
      <SidebarHeader className="p-4 pt-6">
        <div className="flex items-center gap-2 px-2">
          <div className="bg-primary rounded-md p-1.5 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-sidebar-foreground tracking-tight">
            Performance
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link to={item.path} className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {user && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full flex shrink-0 items-center justify-center text-white font-bold text-sm shadow-sm bg-indigo-600">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">
                  {user.email?.split('@')[0]}
                </p>
                <p className="text-[11px] text-sidebar-foreground/60 truncate font-medium">
                  Logado(a)
                </p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="p-2 hover:bg-red-50 rounded-md text-sidebar-foreground/50 hover:text-red-600 transition-colors"
              title="Sair do sistema"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
