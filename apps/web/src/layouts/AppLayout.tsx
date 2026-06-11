import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AppLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function AppLayout({ sidebar, children }: AppLayoutProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <aside className="w-60 shrink-0 border-r bg-sidebar flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {sidebar}
        </div>
        <div className="border-t p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <Avatar className="size-7 shrink-0">
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start min-w-0">
                  <span className="font-medium truncate w-full text-left">{user?.name}</span>
                  <span className="text-xs text-muted-foreground truncate w-full text-left">{user?.email}</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-52">
              <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                <Settings className="size-4" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => { logout(); navigate('/login'); }}
              >
                <LogOut className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      <main className="flex flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
