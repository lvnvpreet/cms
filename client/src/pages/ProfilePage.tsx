import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Assuming Textarea component exists
import { Spinner } from '@/components/core/Spinner';
// import { useAuth } from '@/hooks/useAuth'; // Placeholder for user data
// import { fetchUserProfile, updateUserProfile } from '@/services/userService'; // Placeholder

// Mock user profile data structure
interface UserProfile {
  id: string;
  name: string;
  email: string; // Usually fetched but might not be editable here
  avatarUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  activityHistory?: { timestamp: string; action: string }[];
  // Add portfolio items, skills, etc. if needed
}

const ProfilePage: React.FC = () => {
  // const { user } = useAuth(); // Get user ID or basic info
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading initial profile
  const [isSaving, setIsSaving] = useState(false); // Saving changes
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Replace with actual API call, assuming we have the user's ID
        // const userId = user?.id; // Get from auth context
        // if (!userId) throw new Error("User not authenticated");
        // const data = await fetchUserProfile(userId);

        // Mock data for now
        await new Promise(resolve => setTimeout(resolve, 700));
        const mockData: UserProfile = {
          id: 'user-demo-id',
          name: 'Demo User',
          email: 'demo@example.com',
          avatarUrl: '/avatars/default.png',
          bio: 'A passionate developer exploring the world of CMS.',
          location: 'San Francisco, CA',
          website: 'https://example.com',
          socialLinks: { twitter: 'demouser', github: 'demouser' },
          activityHistory: [
            { timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), action: 'Updated site "My Portfolio"' },
            { timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), action: 'Published new template "Minimalist"' },
          ],
        };
        setProfile(mockData);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile data.');
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [/* user?.id */]); // Dependency on user ID

  // Handler for input changes during editing
  const handleInputChange = (field: keyof Omit<UserProfile, 'id' | 'email' | 'activityHistory'>, value: any) => {
    // Special handling for nested socialLinks
    if (field === 'socialLinks') {
       setProfile(prev => prev ? { ...prev, socialLinks: { ...prev.socialLinks, ...value } } : null);
    } else {
       setProfile(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  // Handler for saving changes
  const handleSaveChanges = async () => {
    if (!profile) return;
    setIsSaving(true);
    setError(null);
    try {
      // Replace with actual API call
      // await updateUserProfile(profile.id, profile); // Pass relevant profile data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsEditing(false); // Exit editing mode on success
      // Show success notification
      console.log('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError('Failed to save profile changes.');
      // Show error notification
    } finally {
      setIsSaving(false);
    }
  };

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" /> <p className="ml-4">Loading Profile...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  if (!profile) {
    return <div className="text-center py-10">Profile data not available.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl"> {/* Limit width for profile */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-start">
          <div>
            <CardTitle className="text-2xl">User Profile</CardTitle>
            <CardDescription>View and manage your profile information.</CardDescription>
          </div>
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ) : (
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancel</Button>
              <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? <Spinner size="sm" className="mr-2" /> : null} Save Changes
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <img
              src={profile.avatarUrl || '/avatars/default.png'}
              alt="Avatar"
              className="h-24 w-24 rounded-full bg-muted object-cover"
            />
            <div className="flex-grow space-y-2 text-center sm:text-left">
              {isEditing ? (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="profileName">Name</Label>
                    <Input id="profileName" value={profile.name} onChange={(e) => handleInputChange('name', e.target.value)} />
                  </div>
                  <Button variant="outline" size="sm">Upload New Avatar</Button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">{profile.name}</h2>
                  <p className="text-muted-foreground">{profile.email}</p>
                  {profile.location && <p className="text-sm text-muted-foreground">{profile.location}</p>}
                </>
              )}
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-1">
            <Label htmlFor="profileBio">Bio</Label>
            {isEditing ? (
              <Textarea
                id="profileBio"
                value={profile.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            ) : (
              <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio || 'No bio provided.'}</p>
            )}
          </div>

          {/* Website and Location (Editable) */}
          {isEditing && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1">
                 <Label htmlFor="profileLocation">Location</Label>
                 <Input id="profileLocation" value={profile.location || ''} onChange={(e) => handleInputChange('location', e.target.value)} placeholder="e.g., San Francisco, CA" />
               </div>
               <div className="space-y-1">
                 <Label htmlFor="profileWebsite">Website</Label>
                 <Input id="profileWebsite" type="url" value={profile.website || ''} onChange={(e) => handleInputChange('website', e.target.value)} placeholder="https://yourwebsite.com" />
               </div>
             </div>
          )}

          {/* Social Links */}
          <div className="space-y-2">
             <h3 className="font-semibold">Social Links</h3>
             {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="space-y-1">
                      <Label htmlFor="twitterLink">Twitter Handle</Label>
                      <Input id="twitterLink" value={profile.socialLinks?.twitter || ''} onChange={(e) => handleInputChange('socialLinks', { twitter: e.target.value })} placeholder="yourhandle" />
                   </div>
                   <div className="space-y-1">
                      <Label htmlFor="linkedinLink">LinkedIn Profile URL</Label>
                      <Input id="linkedinLink" type="url" value={profile.socialLinks?.linkedin || ''} onChange={(e) => handleInputChange('socialLinks', { linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
                   </div>
                   <div className="space-y-1">
                      <Label htmlFor="githubLink">GitHub Handle</Label>
                      <Input id="githubLink" value={profile.socialLinks?.github || ''} onChange={(e) => handleInputChange('socialLinks', { github: e.target.value })} placeholder="yourhandle" />
                   </div>
                </div>
             ) : (
                <div className="flex space-x-4 text-muted-foreground">
                   {profile.socialLinks?.twitter && <span>Twitter: @{profile.socialLinks.twitter}</span>}
                   {profile.socialLinks?.linkedin && <span>LinkedIn</span> /* Link component needed */}
                   {profile.socialLinks?.github && <span>GitHub: {profile.socialLinks.github}</span>}
                   {!profile.socialLinks?.twitter && !profile.socialLinks?.linkedin && !profile.socialLinks?.github && <p>No social links provided.</p>}
                </div>
             )}
          </div>

          {/* Activity History (Read-only) */}
          {!isEditing && profile.activityHistory && profile.activityHistory.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Recent Activity</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                {profile.activityHistory.slice(0, 5).map((activity, index) => ( // Show latest 5
                  <li key={index}>
                    {activity.action} - <span className="text-xs">{new Date(activity.timestamp).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Placeholder for other sections like Portfolio, Skills, etc. */}

        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
