// client/src/pages/RegisterPage.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RegisterForm } from '@/components/auth/RegisterForm'; // Import the new form component

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  // Callback function to handle successful registration
  const handleRegisterSuccess = () => {
    // Redirect to login page or dashboard after registration
    navigate('/login?registered=true'); // Redirect to login with a flag
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Start building your website today.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Render the RegisterForm component */}
          <RegisterForm onRegisterSuccess={handleRegisterSuccess} />

          {/* Link to Login Page */}
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
