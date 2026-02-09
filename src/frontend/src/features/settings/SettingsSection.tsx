import { useState, useRef } from 'react';
import { useTasker } from '../../state/TaskerProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Upload, Link as LinkIcon } from 'lucide-react';

export function SettingsSection() {
  const { state, updateTheme } = useTasker();
  const theme = state.theme ?? { mode: 'light', backgroundType: 'default' };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleModeToggle = (checked: boolean) => {
    updateTheme({ mode: checked ? 'dark' : 'light' });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    // Convert hex to OKLCH approximation (simplified)
    updateTheme({ accentColor: color });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateTheme({
        backgroundType: 'image',
        backgroundImage: dataUrl
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) return;
    updateTheme({
      backgroundType: 'url',
      backgroundImage: imageUrl
    });
  };

  const handleResetBackground = () => {
    updateTheme({
      backgroundType: 'default',
      backgroundImage: undefined
    });
    setImageUrl('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Customize your app experience</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Customize the appearance of your app</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark theme
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={theme.mode === 'dark'}
              onCheckedChange={handleModeToggle}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="accent-color">Accent Color</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Choose a custom accent color for the app
            </p>
            <Input
              id="accent-color"
              type="color"
              className="h-12 w-24 cursor-pointer"
              onChange={handleColorChange}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label>Background Image</Label>
              <p className="text-sm text-muted-foreground">
                Upload an image or provide a URL
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </Button>
                <Button
                  variant="outline"
                  onClick={handleResetBackground}
                >
                  Reset to Default
                </Button>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Enter image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleUrlSubmit}
                  disabled={!imageUrl.trim()}
                >
                  <LinkIcon className="w-4 h-4" />
                  Apply URL
                </Button>
              </div>

              {theme.backgroundType !== 'default' && theme.backgroundImage && (
                <p className="text-xs text-muted-foreground">
                  Background image applied
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
