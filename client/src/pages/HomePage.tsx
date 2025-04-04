import React from 'react';
import { Link } from 'react-router-dom'; // Assuming react-router-dom is used for navigation
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button component
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming shadcn/ui Card component

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">Build Your Dream Website Effortlessly</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Our intuitive CMS platform empowers you to create stunning, professional websites without writing a single line of code.
        </p>
        <div className="space-x-4">
          <Button asChild size="lg">
            <Link to="/register">Get Started Free</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/login">Login</Link>
          </Button>
        </div>
        {/* Placeholder for animated demo/screenshot */}
        <div className="mt-12 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">[Animated Demo/Platform Screenshot Placeholder]</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Visual Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Drag-and-drop interface for easy page building.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Choose from a wide variety of professional templates.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Responsive Design</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Sites look great on all devices, automatically.</p>
            </CardContent>
          </Card>
          {/* Add more feature cards as needed */}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-secondary/50 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="text-center">
          <p className="italic text-lg mb-4">"This CMS made building my portfolio a breeze!"</p>
          <p className="font-semibold">- Happy Customer</p>
          {/* Placeholder for more testimonials */}
        </div>
      </section>

      {/* Pricing Section (Optional) */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing Plans</h2>
        <div className="text-center">
          <p className="text-muted-foreground">[Pricing Table Placeholder - Add if applicable]</p>
          {/* Example: Link to a dedicated pricing page */}
          {/* <Button asChild variant="link"><Link to="/pricing">View Plans</Link></Button> */}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center py-16">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join thousands of users building amazing websites with our platform.
        </p>
        <Button asChild size="lg">
          <Link to="/register">Sign Up Now</Link>
        </Button>
      </section>

      {/* Help/Documentation Link */}
      <footer className="text-center py-8 border-t mt-12">
        <p>Need help? Visit our <Link to="/docs" className="text-primary underline">Documentation</Link>.</p>
        {/* Placeholder for Newsletter Signup/Contact */}
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">[Newsletter Signup / Contact Form Placeholder]</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
