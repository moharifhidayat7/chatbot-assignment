import { useSettings } from '../hooks/useSettings';
import type { Theme } from '../types/settings.types';
import { Button } from '@/components/ui/button';

const options: Theme[] = ['light', 'dark', 'system'];

export function ThemeToggle() {
  const { settings, setTheme } = useSettings();
  return (
    <div className="flex gap-2">
      {options.map((t) => (
        <Button
          key={t}
          variant={settings.theme === t ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTheme(t)}
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </Button>
      ))}
    </div>
  );
}
