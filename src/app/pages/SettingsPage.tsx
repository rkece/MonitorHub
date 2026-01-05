import { motion } from 'motion/react';
import { Moon, Sun, Monitor, Palette, Layout, Settings as SettingsIcon } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface SettingsPageProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  accentColor: string;
  onAccentColorChange: (color: string) => void;
}

export function SettingsPage({ darkMode, onToggleDarkMode, accentColor, onAccentColorChange }: SettingsPageProps) {
  return (
    <div className="p-6 space-y-6">
      <Breadcrumbs currentPage="settings" />
      
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Customize your monitoring dashboard experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings navigation */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Settings Categories</h3>
            <div className="space-y-2">
              {[
                { icon: Palette, label: 'Appearance', active: true },
                { icon: Layout, label: 'Layout', active: false },
                { icon: SettingsIcon, label: 'Preferences', active: false },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      item.active
                        ? 'bg-purple-500 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Settings content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Theme settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Appearance</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Customize the look and feel</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Dark mode toggle */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Label className="text-slate-900 dark:text-white">Theme Mode</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Switch between light and dark mode</p>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={onToggleDarkMode} />
                  </div>

                  {/* Theme preview cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        !darkMode
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                      onClick={() => !darkMode || onToggleDarkMode()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Sun className="w-5 h-5 text-orange-500" />
                        <span className="font-semibold text-slate-900 dark:text-white">Light</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-6 bg-slate-200 rounded" />
                        <div className="h-4 bg-slate-100 rounded w-3/4" />
                        <div className="h-4 bg-slate-100 rounded w-1/2" />
                      </div>
                    </motion.div>

                    <motion.div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        darkMode
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                      onClick={() => darkMode || onToggleDarkMode()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Moon className="w-5 h-5 text-purple-500" />
                        <span className="font-semibold text-slate-900 dark:text-white">Dark</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-6 bg-slate-700 rounded" />
                        <div className="h-4 bg-slate-800 rounded w-3/4" />
                        <div className="h-4 bg-slate-800 rounded w-1/2" />
                      </div>
                    </motion.div>
                  </div>
                </div>

                <Separator />

                {/* Color accent */}
                <div>
                  <Label className="text-slate-900 dark:text-white mb-3 block">Accent Color</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Choose your preferred accent color</p>
                  <div className="grid grid-cols-6 gap-3">
                    {[
                      { name: 'purple', color: 'bg-purple-500', ringColor: 'ring-purple-500' },
                      { name: 'blue', color: 'bg-blue-500', ringColor: 'ring-blue-500' },
                      { name: 'green', color: 'bg-green-500', ringColor: 'ring-green-500' },
                      { name: 'orange', color: 'bg-orange-500', ringColor: 'ring-orange-500' },
                      { name: 'pink', color: 'bg-pink-500', ringColor: 'ring-pink-500' },
                      { name: 'red', color: 'bg-red-500', ringColor: 'ring-red-500' },
                    ].map((accent) => (
                      <motion.button
                        key={accent.name}
                        className={`w-12 h-12 rounded-lg ${accent.color} ${
                          accentColor === accent.color ? `ring-2 ring-offset-2 ${accent.ringColor} dark:ring-offset-slate-900` : ''
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        title={accent.name.charAt(0).toUpperCase() + accent.name.slice(1)}
                        onClick={() => onAccentColorChange(accent.color)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Layout settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Layout className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Layout Preferences</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Adjust the dashboard layout</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Density */}
                <div>
                  <Label className="text-slate-900 dark:text-white mb-3 block">Layout Density</Label>
                  <RadioGroup defaultValue="comfortable">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="compact" id="compact" />
                          <Label htmlFor="compact" className="cursor-pointer">
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">Compact</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">More content, less spacing</p>
                            </div>
                          </Label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="comfortable" id="comfortable" />
                          <Label htmlFor="comfortable" className="cursor-pointer">
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">Comfortable</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">Balanced spacing and content</p>
                            </div>
                          </Label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="spacious" id="spacious" />
                          <Label htmlFor="spacious" className="cursor-pointer">
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">Spacious</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">More spacing, easier to read</p>
                            </div>
                          </Label>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Card style */}
                <div>
                  <Label className="text-slate-900 dark:text-white mb-3 block">Card Style</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      className="p-4 rounded-lg border-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="mb-2 font-semibold text-slate-900 dark:text-white">Elevated</div>
                      <div className="h-16 bg-white dark:bg-slate-800 rounded shadow-lg" />
                    </motion.div>
                    <motion.div
                      className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="mb-2 font-semibold text-slate-900 dark:text-white">Flat</div>
                      <div className="h-16 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Additional settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <SettingsIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Additional Settings</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Other preferences and options</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Enable animations', description: 'Show smooth transitions and effects', checked: true },
                  { label: 'Auto-refresh data', description: 'Automatically update dashboard data', checked: true },
                  { label: 'Sound notifications', description: 'Play sound for critical alerts', checked: false },
                  { label: 'Desktop notifications', description: 'Show browser notifications', checked: true },
                ].map((setting, index) => (
                  <div key={setting.label} className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-0">
                    <div>
                      <Label className="text-slate-900 dark:text-white">{setting.label}</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{setting.description}</p>
                    </div>
                    <Switch defaultChecked={setting.checked} />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Save button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end gap-3"
          >
            <Button variant="outline">Reset to Default</Button>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              Save Changes
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}