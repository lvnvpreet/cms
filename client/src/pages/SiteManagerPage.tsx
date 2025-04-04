import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/core/Spinner';
import { Site } from '@/types'; // Import the Site type
// import { fetchSiteDetails } from '@/services/siteService'; // Placeholder

// Mock data structure for site details (extend Site type if needed)
interface SiteDetails extends Site {
  // Add more detailed fields specific to the manager view
  domain?: string;
  plan?: string;
  storageUsed?: number; // in MB
  bandwidthUsed?: number; // in GB
  collaborators?: { id: string; name: string; role: string }[];
  // Add structure for pages, media library items, etc.
  pagesList?: { id: string; title: string; path: string; status: 'draft' | 'published' }[];
  mediaCount?: number;
  backupHistory?: { date: string; file: string }[];
}

const SiteManagerPage: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>(); // siteId is required for this page
  const [siteDetails, setSiteDetails] = useState<SiteDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSiteDetails = async () => {
      if (!siteId) {
        setError('Site ID is missing.');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        // Replace with actual API call
        // const data = await fetchSiteDetails(siteId);
        // Mock data for now:
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
        const mockData: SiteDetails = {
          id: siteId,
          name: `Managed Site ${siteId}`,
          thumbnailUrl: '/placeholder-thumb.jpg',
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'published',
          domain: `site-${siteId}.example.com`,
          plan: 'Pro Plan',
          storageUsed: 512,
          bandwidthUsed: 15.3,
          collaborators: [{ id: 'user1', name: 'Alice', role: 'Admin' }, { id: 'user2', name: 'Bob', role: 'Editor' }],
          pagesList: [
            { id: 'p1', title: 'Home', path: '/', status: 'published' },
            { id: 'p2', title: 'About Us', path: '/about', status: 'published' },
            { id: 'p3', title: 'Contact', path: '/contact', status: 'draft' },
          ],
          mediaCount: 150,
          backupHistory: [{ date: new Date().toISOString(), file: `backup-${siteId}-today.zip` }],
        };
        setSiteDetails(mockData);
      } catch (err) {
        console.error('Failed to load site details:', err);
        setError(`Failed to load details for site ID: ${siteId}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadSiteDetails();
  }, [siteId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
        <p className="ml-4">Loading Site Manager...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  if (!siteDetails) {
    return <div className="text-center py-10">Site details not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{siteDetails.name}</h1>
          <p className="text-muted-foreground">Site Management</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" asChild>
            <Link to={`/preview/${siteId}`} target="_blank">Preview Site</Link>
          </Button>
          <Button asChild>
            <Link to={`/editor/${siteId}`}>Open Editor</Link>
          </Button>
        </div>
      </div>

      {/* Overview Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Site Overview</CardTitle>
          <CardDescription>Key information about your site.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><span className="font-semibold">Status:</span> {siteDetails.status}</div>
          <div><span className="font-semibold">Domain:</span> {siteDetails.domain || 'Not set'}</div>
          <div><span className="font-semibold">Created:</span> {new Date(siteDetails.createdAt).toLocaleDateString()}</div>
          <div><span className="font-semibold">Last Modified:</span> {new Date(siteDetails.lastModified).toLocaleDateString()}</div>
          <div><span className="font-semibold">Plan:</span> {siteDetails.plan || 'Free'}</div>
          <div><span className="font-semibold">Storage:</span> {siteDetails.storageUsed} MB used</div>
          {/* Add more overview stats */}
        </CardContent>
      </Card>

      {/* Management Tabs */}
      <Tabs defaultValue="pages" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-4">
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media Library</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          {/* Add more tabs like Analytics, Team, etc. */}
        </TabsList>

        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle>Page Management</CardTitle>
              <CardDescription>Create, edit, delete, and organize your site pages.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for Page Management UI */}
              <p className="text-muted-foreground">[Page List and Management Tools Placeholder]</p>
              <ul>
                {siteDetails.pagesList?.map(page => (
                  <li key={page.id} className="flex justify-between items-center py-1 border-b">
                    <span>{page.title} ({page.path}) - {page.status}</span>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </li>
                ))}
              </ul>
              <Button className="mt-4">Add New Page</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Organization</CardTitle>
              <CardDescription>Manage reusable content blocks, collections, or data sources.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">[Content Organization Tools Placeholder]</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
              <CardDescription>Upload and manage images, videos, and other files.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">[Media Library Grid/List Placeholder]</p>
              <p>Total Media Items: {siteDetails.mediaCount}</p>
              <Button className="mt-4">Upload Media</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>Configure site-wide settings like domain, integrations, and general preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">[Site Settings Form Placeholder - Domain, Favicon, Analytics ID, etc.]</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Tools</CardTitle>
              <CardDescription>Manage SEO settings, sitemaps, and meta descriptions.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">[SEO Configuration and Analysis Tools Placeholder]</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backups">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>Manage site backups and restore previous versions.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">[Backup History List and Restore Options Placeholder]</p>
              <ul>
                {siteDetails.backupHistory?.map((backup, index) => (
                  <li key={index} className="flex justify-between items-center py-1 border-b">
                    <span>Backup from {new Date(backup.date).toLocaleString()}</span>
                    <Button variant="outline" size="sm">Restore</Button>
                  </li>
                ))}
              </ul>
              <Button className="mt-4">Create New Backup</Button>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default SiteManagerPage;
