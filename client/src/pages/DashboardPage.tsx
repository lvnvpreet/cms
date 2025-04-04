import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SiteList from '@/components/site/SiteList'; // Use default import
import { Site } from '@/types'; // Import Site type from central types file
import { Spinner } from '@/components/core/Spinner'; // Assuming Spinner component exists
// import { fetchDashboardData } from '@/services/userService'; // Assuming a service function

// Define DashboardData using the imported Site type
interface DashboardData {
  sites: Site[];
  recentActivity: string[];
  notifications: string[];
  stats: {
    totalSites: number;
    publishedSites: number;
  };
}

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with actual API call
        // const data = await fetchDashboardData();
        // Mock data for now:
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        // Create mock data conforming to the Site interface
        const mockSites: Site[] = [
          { id: '1', name: 'My Portfolio', lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), status: 'published', thumbnailUrl: '/placeholder-thumb.jpg' },
          { id: '2', name: 'Company Blog', lastModified: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), status: 'draft', thumbnailUrl: '/placeholder-thumb.jpg' },
          { id: '3', name: 'E-commerce Store', lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), status: 'published', thumbnailUrl: '/placeholder-thumb.jpg' },
          { id: '4', name: 'Archived Project', lastModified: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), status: 'archived', thumbnailUrl: '/placeholder-thumb.jpg' },
        ];
        const mockData: DashboardData = {
          sites: mockSites,
          recentActivity: [
            'Updated "About Us" page on My Portfolio',
            'Published new post on Company Blog',
            'Archived project "Old Campaign"',
          ],
          notifications: [
            'System update scheduled for tomorrow',
            'New template available: "Minimalist Business"',
            'Subscription renewal due next week',
          ],
          stats: {
            totalSites: mockSites.length, // Use dynamic length
            publishedSites: mockSites.filter(site => site.status === 'published').length, // Calculate dynamically
          },
        };
        setDashboardData(mockData);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" /> {/* Use 'lg' instead of 'large' */}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  if (!dashboardData) {
    return <div className="text-center py-10">No dashboard data available.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/editor/new">Create New Site</Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <section className="grid md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{dashboardData.stats.totalSites}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Published Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{dashboardData.stats.publishedSites}</p>
          </CardContent>
        </Card>
        {/* Add more stats cards if needed */}
      </section>

      {/* Site List */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Sites</CardTitle>
            <CardDescription>Manage your existing websites.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Pass required props to SiteList */}
            <SiteList
              sites={dashboardData.sites}
              isLoading={loading} // Pass loading state
              error={error}       // Pass error state
              // Provide placeholder handlers for required functions
              onEditSite={(id) => console.log('Edit site:', id)}
              onPreviewSite={(id) => console.log('Preview site:', id)}
              onPublishSite={(id) => console.log('Publish site:', id)}
              onDeleteSite={(id) => console.log('Delete site:', id)}
              onCreateNewSite={() => console.log('Create new site')}
            />
            {/* Fallback if SiteList component is not ready */}
            {/* <ul>
              {dashboardData.sites.map(site => (
                <li key={site.id} className="border-b py-2 flex justify-between items-center">
                  <span>{site.name} ({site.status}) - Updated {site.lastUpdated}</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/site-manager/${site.id}`}>Manage</Link>
                  </Button>
                </li>
              ))}
            </ul> */}
          </CardContent>
        </Card>
      </section>

      {/* Recent Activity & Notifications */}
      <section className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              {dashboardData.recentActivity.map((activity, index) => (
                <li key={index}>{activity}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              {dashboardData.notifications.map((notification, index) => (
                <li key={index}>{notification}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Other sections like Announcements, Recommendations etc. can be added here */}

    </div>
  );
};

export default DashboardPage;
