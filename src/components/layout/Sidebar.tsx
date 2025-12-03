import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCog,
  Link2,
  ShieldCheck,
  Copy,
  Vote,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/voters', icon: Users, label: 'Voters' },
  { path: '/booths', icon: Building2, label: 'Booths' },
  { path: '/officers', icon: UserCog, label: 'Officers' },
  { path: '/assignments', icon: Link2, label: 'Assignments' },
  { path: '/eligibility', icon: ShieldCheck, label: 'Eligibility Check' },
  { path: '/duplicate', icon: Copy, label: 'Duplicate Check' },
  { path: '/voting-status', icon: Vote, label: 'Voting Status' },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 z-50 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Vote className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-sm">Voter Management</h1>
              <p className="text-xs text-sidebar-foreground/60">System v1.0</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center mx-auto">
            <Vote className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon className={cn('w-5 h-5 flex-shrink-0', collapsed && 'mx-auto')} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-accent transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Footer */}
      <div className={cn('p-4 border-t border-sidebar-border', collapsed && 'px-2')}>
        {!collapsed && (
          <div className="text-xs text-sidebar-foreground/50">
            <p>Election Commission</p>
            <p>© 2024 All Rights Reserved</p>
          </div>
        )}
      </div>
    </aside>
  );
}
