import { useState } from 'react';
import { SidebarNav } from './SidebarNav';
import { DashboardSection } from '../../features/dashboard/DashboardSection';
import { CalendarSection } from '../../features/calendar/CalendarSection';
import { PomodoroSection } from '../../features/pomodoro/PomodoroSection';
import { AchievementsSection } from '../../features/achievements/AchievementsSection';
import { SettingsSection } from '../../features/settings/SettingsSection';
import { useTasker } from '../../state/TaskerProvider';
import { useThemeSettings } from '../../hooks/useThemeSettings';

export type Section = 'dashboard' | 'calendar' | 'pomodoro' | 'achievements' | 'settings';

export function AppLayout() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const { state } = useTasker();
  
  // Apply theme settings
  useThemeSettings(state.theme);

  return (
    <div className="flex min-h-screen bg-background app-background">
      <SidebarNav activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="flex-1 overflow-auto">
        <div className="container max-w-7xl mx-auto p-6 md:p-8">
          <div style={{ display: activeSection === 'dashboard' ? 'block' : 'none' }}>
            <DashboardSection />
          </div>
          <div style={{ display: activeSection === 'calendar' ? 'block' : 'none' }}>
            <CalendarSection />
          </div>
          <div style={{ display: activeSection === 'pomodoro' ? 'block' : 'none' }}>
            <PomodoroSection />
          </div>
          <div style={{ display: activeSection === 'achievements' ? 'block' : 'none' }}>
            <AchievementsSection />
          </div>
          <div style={{ display: activeSection === 'settings' ? 'block' : 'none' }}>
            <SettingsSection />
          </div>
        </div>
      </main>
    </div>
  );
}
