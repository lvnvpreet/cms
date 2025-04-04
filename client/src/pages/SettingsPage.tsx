import React, { useState } from 'react'; // Import useState
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/core/Spinner'; // Import Spinner
// import { useAuth } from '@/hooks/useAuth'; // Placeholder for user data
// import { updateUserSettings, updateUserProfile } from '@/services/userService'; // Placeholder

// Mock user settings data structure
interface UserSettings {
  profile: {
    name: string;
    email: string;
    avatarUrl?: string;
    bio?: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
      emailUpdates: boolean;
      inAppAnnouncements: boolean;
    };
  };
  security: {
    twoFactorEnabled: boolean;
  };
  integrations: {
    googleAnalyticsId?: string;
    // Add other integrations
  };
  // Add billing/subscription info if applicable
}

const SettingsPage: React.FC = () => {
  // const { user } = useAuth(); // Get user data from auth context/hook
  // Placeholder for settings state - fetch actual settings in useEffect
  const [settings, setSettings] = useState<UserSettings>({
    profile: { name: 'Demo User', email: 'demo@example.com', avatarUrl: '/avatars/default.png' },
    preferences: { theme: 'system', language: 'en', notifications: { emailUpdates: true, inAppAnnouncements: true } },
    security: { twoFactorEnabled: false },
    integrations: {},
  });
  const [isLoading, setIsLoading] = useState(false); // For save operations
  const [activeTab, setActiveTab] = useState('profile');

  // Handlers for updating settings (implement actual logic)
  const handleProfileChange = (field: keyof UserSettings['profile'], value: any) => {
    setSettings((prev: UserSettings) => ({ ...prev, profile: { ...prev.profile, [field]: value } }));
  };

  const handlePreferencesChange = (field: keyof UserSettings['preferences'], value: any) => {
     // Handle nested notification changes
     if (field === 'notifications') {
       setSettings((prev: UserSettings) => ({
         ...prev,
         preferences: {
           ...prev.preferences,
           notifications: { ...prev.preferences.notifications, ...value }
         }
       }));
     } else {
       setSettings((prev: UserSettings) => ({ ...prev, preferences: { ...prev.preferences, [field]: value } }));
     }
  };

  const handleSecurityChange = (field: keyof UserSettings['security'], value: any) => {
    setSettings((prev: UserSettings) => ({ ...prev, security: { ...prev.security, [field]: value } }));
  };

  // Placeholder save function
  const handleSaveChanges = async (section: keyof UserSettings) => {
    setIsLoading(true);
    console.log(`Saving ${section} settings:`, settings[section]);
    try {
      // Example: Call appropriate service function based on section
      // if (section === 'profile') await updateUserProfile(settings.profile);
      // if (section === 'preferences') await updateUserSettings({ preferences: settings.preferences });
      // etc.
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      // Show success notification (using a toast library like sonner)
      console.log(`${section} settings saved successfully!`);
    } catch (error) {
      console.error(`Failed to save ${section} settings:`, error);
      // Show error notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          {/* Add Billing/Subscription tab if needed */}
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your public profile information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                 <img src={settings.profile.avatarUrl || '/avatars/default.png'} alt="Avatar" className="h-16 w-16 rounded-full bg-muted" />
                 <Button variant="outline" size="sm">Change Avatar</Button>
              </div>
              <div className="space-y-1">
                <Label htmlFor="profileName">Name</Label>
                <Input id="profileName" value={settings.profile.name} onChange={(e) => handleProfileChange('name', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="profileEmail">Email</Label>
                <Input id="profileEmail" type="email" value={settings.profile.email} disabled /> {/* Usually email is not directly editable here */}
              </div>
               <div className="space-y-1">
                <Label htmlFor="profileBio">Bio</Label>
                <textarea
                  id="profileBio"
                  value={settings.profile.bio || ''}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  className="w-full p-2 border rounded min-h-[80px]"
                  placeholder="Tell us a little about yourself..."
                />
              </div>
              <Button onClick={() => handleSaveChanges('profile')} disabled={isLoading}>
                {isLoading ? <Spinner size="sm" className="mr-2" /> : null} Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Settings */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your application experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={settings.preferences.theme} onValueChange={(value) => handlePreferencesChange('theme', value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System Default</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                 <Label>Language</Label>
                 <Select value={settings.preferences.language} onValueChange={(value) => handlePreferencesChange('language', value)}>
                   <SelectTrigger className="w-[180px]">
                     <SelectValue placeholder="Select language" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="en">English</SelectItem>
                     <SelectItem value="es">Español</SelectItem>
                     {/* Add more languages */}
                   </SelectContent>
                 </Select>
              </div>
              <div className="space-y-2">
                 <Label>Notifications</Label>
                 <div className="flex items-center space-x-2">
                   <Checkbox
                     id="emailUpdates"
                     checked={settings.preferences.notifications.emailUpdates}
                     onCheckedChange={(checked) => handlePreferencesChange('notifications', { emailUpdates: checked })}
                   />
                   <Label htmlFor="emailUpdates">Receive email updates</Label>
                 </div>
                 <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inAppAnnouncements"
                      checked={settings.preferences.notifications.inAppAnnouncements}
                      onCheckedChange={(checked) => handlePreferencesChange('notifications', { inAppAnnouncements: checked })}
                    />
                    <Label htmlFor="inAppAnnouncements">Show in-app announcements</Label>
                 </div>
              </div>
              <Button onClick={() => handleSaveChanges('preferences')} disabled={isLoading}>
                 {isLoading ? <Spinner size="sm" className="mr-2" /> : null} Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your account security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Password</h3>
                <Button variant="outline">Change Password</Button>
              </div>
              <div>
                 <h3 className="font-semibold mb-2">Two-Factor Authentication (2FA)</h3>
                 <div className="flex items-center space-x-2">
                    <Checkbox
                      id="twoFactorEnabled"
                      checked={settings.security.twoFactorEnabled}
                      onCheckedChange={(checked) => handleSecurityChange('twoFactorEnabled', checked)}
                    />
                    <Label htmlFor="twoFactorEnabled">Enable Two-Factor Authentication</Label>
                 </div>
                 {/* Add setup instructions/status if enabled */}
              </div>
              {/* Add API Key Management if applicable */}
              <Button onClick={() => handleSaveChanges('security')} disabled={isLoading}>
                 {isLoading ? <Spinner size="sm" className="mr-2" /> : null} Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connect third-party services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Example: Google Analytics */}
              <div className="space-y-1">
                <Label htmlFor="gaId">Google Analytics ID</Label>
                <Input
                  id="gaId"
                  placeholder="UA-XXXXX-Y"
                  value={settings.integrations.googleAnalyticsId || ''}
                  // onChange={(e) => handleIntegrationChange('googleAnalyticsId', e.target.value)} // Need handler
                />
              </div>
              {/* Add more integration sections */}
              <p className="text-sm text-muted-foreground">[Placeholder for other integrations like Mailchimp, Zapier, etc.]</p>
              <Button onClick={() => handleSaveChanges('integrations')} disabled={isLoading}>
                 {isLoading ? <Spinner size="sm" className="mr-2" /> : null} Save Integrations
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default SettingsPage;
