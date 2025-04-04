import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-background">
      {/* Optional: Add a relevant graphic or illustration */}
      {/* <img src="/path/to/404-graphic.svg" alt="Page Not Found" className="w-64 h-64 mb-8" /> */}

      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Oops! Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>

      {/* Navigation Buttons */}
      <div className="space-x-4">
        <Button asChild>
          <Link to="/">Go to Homepage</Link>
        </Button>
        {/* Optionally, link to dashboard if user might be logged in */}
        {/* <Button variant="outline" asChild>
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button> */}
      </div>

      {/* Optional: Search Bar */}
      {/* <div className="mt-12 w-full max-w-sm">
        <Input type="search" placeholder="Search the site..." />
      </div> */}

      {/* Optional: Suggested Links */}
      {/* <div className="mt-8 text-sm">
        <p className="text-muted-foreground mb-2">Maybe you were looking for:</p>
        <ul className="space-y-1">
          <li><Link to="/features" className="text-primary hover:underline">Features</Link></li>
          <li><Link to="/pricing" className="text-primary hover:underline">Pricing</Link></li>
          <li><Link to="/contact" className="text-primary hover:underline">Contact Us</Link></li>
        </ul>
      </div> */}

      {/* Optional: Report Link */}
      {/* <p className="mt-12 text-xs text-muted-foreground">
        Think this is an error? <Link to="/support" className="underline">Let us know</Link>.
      </p> */}
    </div>
  );
};

export default NotFoundPage;
