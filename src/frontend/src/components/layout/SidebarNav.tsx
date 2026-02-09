import { LayoutDashboard, Calendar, Timer, Trophy, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Section } from './AppLayout';

interface SidebarNavProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

const navItems = [
  { id: 'dashboard' as Section, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'calendar' as Section, label: 'Calendar', icon: Calendar },
  { id: 'pomodoro' as Section, label: 'Pomodoro Timer', icon: Timer },
  { id: 'achievements' as Section, label: 'Achievements', icon: Trophy },
  { id: 'settings' as Section, label: 'Settings', icon: Settings }
];

function SidebarContent({ activeSection, onSectionChange }: SidebarNavProps) {
  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/generated/tasker-logo.dim_512x512.png" 
            alt="Truly Tasker" 
            className="w-10 h-10"
          />
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">Truly Tasker</h1>
            <p className="text-xs text-sidebar-foreground/60">Class 10th</p>
          </div>
        </div>
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? 'default' : 'ghost'}
              className={`w-full justify-start gap-3 ${
                isActive 
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </nav>
      
      <Separator className="bg-sidebar-border" />
      
      <div className="p-4">
        <p className="text-xs text-center text-sidebar-foreground/50">
          Developed product by Aditya Verma
        </p>
      </div>
    </div>
  );
}

export function SidebarNav({ activeSection, onSectionChange }: SidebarNavProps) {
  return (
    <>
      {/* Mobile sidebar */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SidebarContent activeSection={activeSection} onSectionChange={onSectionChange} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 border-r border-sidebar-border">
        <SidebarContent activeSection={activeSection} onSectionChange={onSectionChange} />
      </aside>
    </>
  );
}
