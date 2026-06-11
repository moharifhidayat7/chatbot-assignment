import { ThemeToggle } from './ThemeToggle';

export function SettingsPanel() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-sm font-semibold">Settings</h2>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">Theme</span>
        <ThemeToggle />
      </div>
    </div>
  );
}
