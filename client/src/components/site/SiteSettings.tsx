import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Removed CardFooter import as it's unused
import { Toggle } from '@/components/ui/toggle'; // Changed Switch to Toggle
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Define the structure of Site Settings data (adjust as needed)
interface SiteSettingsData {
  id: string; // Assuming settings are tied to a site ID
  name: string;
  description: string;
  // SEO
  metaTitle: string;
  metaDescription: string;
  generateSitemap: boolean;
  // Domain
  customDomain: string;
  // Publishing
  autoPublish: boolean;
  // Access Control (Simplified)
  isPublic: boolean;
  // Analytics (Simplified)
  analyticsId: string;
  // Add more fields as required: backups, versioning, etc.
}

// Define the props for the SiteSettings component
interface SiteSettingsProps {
  siteId: string; // ID of the site whose settings are being edited
  initialSettings: SiteSettingsData | null; // Load initial data
  onSave: (settings: SiteSettingsData) => Promise<void>; // Function to save settings
  onDeleteSite: (id: string) => Promise<void>; // Function to delete the site
  isLoading: boolean; // Loading state for fetching/saving
  // Add onCancel or navigation logic if needed
}

const SiteSettings: React.FC<SiteSettingsProps> = ({
  siteId,
  initialSettings,
  onSave,
  onDeleteSite,
  isLoading,
}) => {
  const [settings, setSettings] = useState<SiteSettingsData | null>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Update local state if initialSettings change (e.g., after loading)
    setSettings(initialSettings);
  }, [initialSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => prev ? { ...prev, [name]: value } : null);
  };

  // Updated to handle Toggle's onPressedChange
  const handleToggleChange = (pressed: boolean, name: keyof SiteSettingsData) => {
     setSettings(prev => prev ? { ...prev, [name]: pressed } : null);
  };

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await onSave(settings);
      // Optionally show success notification
    } catch (error) {
      // Optionally show error notification
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

   const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteSite(siteId);
      // Navigate away or show confirmation
    } catch (error) {
      console.error("Failed to delete site:", error);
      // Show error notification
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && !settings) {
    // Show a loading state for the entire form
    return <Card><CardHeader><CardTitle>Loading Settings...</CardTitle></CardHeader><CardContent><div className="space-y-4"><div className="h-8 bg-gray-200 rounded w-3/4"></div><div className="h-20 bg-gray-200 rounded"></div><div className="h-8 bg-gray-200 rounded w-1/2"></div></div></CardContent></Card>;
  }

  if (!settings) {
     return <Card><CardHeader><CardTitle>Error</CardTitle></CardHeader><CardContent>Could not load site settings.</CardContent></Card>;
  }

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Basic information about your site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Site Name</Label>
            <Input id="name" name="name" value={settings.name} onChange={handleChange} placeholder="My Awesome Site" disabled={isSaving}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Site Description</Label>
            <Textarea id="description" name="description" value={settings.description} onChange={handleChange} placeholder="A short description of your site." disabled={isSaving}/>
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
          <CardDescription>Configure how search engines see your site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input id="metaTitle" name="metaTitle" value={settings.metaTitle} onChange={handleChange} placeholder="Page Title | Site Name" disabled={isSaving}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea id="metaDescription" name="metaDescription" value={settings.metaDescription} onChange={handleChange} placeholder="Concise description for search results." disabled={isSaving}/>
          </div>
           <div className="flex items-center space-x-2">
            <Toggle id="generateSitemap" aria-label="Toggle sitemap generation" pressed={settings.generateSitemap} onPressedChange={(pressed: boolean) => handleToggleChange(pressed, 'generateSitemap')} disabled={isSaving}/>
            <Label htmlFor="generateSitemap">Generate Sitemap Automatically</Label>
          </div>
        </CardContent>
      </Card>

      {/* Domain Settings */}
       <Card>
        <CardHeader>
          <CardTitle>Domain Settings</CardTitle>
          <CardDescription>Manage your site's address.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
            <Label htmlFor="customDomain">Custom Domain</Label>
            <Input id="customDomain" name="customDomain" value={settings.customDomain} onChange={handleChange} placeholder="www.yourdomain.com" disabled={isSaving}/>
            <p className="text-sm text-muted-foreground">Leave blank to use the default subdomain.</p>
          </div>
          {/* Add DNS configuration instructions or status here */}
        </CardContent>
      </Card>

      {/* Publishing & Access */}
       <Card>
        <CardHeader>
          <CardTitle>Publishing & Access</CardTitle>
          <CardDescription>Control how and when your site is available.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center space-x-2">
            <Toggle id="autoPublish" aria-label="Toggle auto-publish" pressed={settings.autoPublish} onPressedChange={(pressed: boolean) => handleToggleChange(pressed, 'autoPublish')} disabled={isSaving}/>
            <Label htmlFor="autoPublish">Auto-publish on Save</Label>
          </div>
           <div className="flex items-center space-x-2">
            <Toggle id="isPublic" aria-label="Toggle public access" pressed={settings.isPublic} onPressedChange={(pressed: boolean) => handleToggleChange(pressed, 'isPublic')} disabled={isSaving}/>
            <Label htmlFor="isPublic">Publicly Accessible</Label>
          </div>
          {/* Add more access control options (password protection, specific users) here */}
        </CardContent>
      </Card>

       {/* Analytics */}
       <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>Integrate with analytics services.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
            <Label htmlFor="analyticsId">Analytics Tracking ID</Label>
            <Input id="analyticsId" name="analyticsId" value={settings.analyticsId} onChange={handleChange} placeholder="e.g., UA-XXXXX-Y or G-XXXXXXX" disabled={isSaving}/>
            <p className="text-sm text-muted-foreground">Enter your Google Analytics ID or similar.</p>
          </div>
        </CardContent>
      </Card>

      {/* Save/Cancel Footer */}
      <div className="flex justify-end gap-2 mt-6">
         {/* Add a Cancel button/link if needed */}
         {/* <Button variant="outline" onClick={onCancel} disabled={isSaving || isDeleting}>Cancel</Button> */}
         <Button onClick={handleSave} disabled={isSaving || isDeleting || isLoading}>
            {isSaving ? 'Saving...' : 'Save Changes'}
         </Button>
      </div>

      <Separator />

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for this site.</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting || isSaving}>
                Delete Site
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the site
                  "{settings.name}" and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, delete site'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <p className="text-sm text-muted-foreground mt-2">
            Deleting your site cannot be recovered. Please be certain.
          </p>
          {/* Add Archive option here if needed */}
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettings;
