import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/core/Spinner';
// import { registerUser } from '@/services/authService'; // Placeholder

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validatePassword = (pw: string): boolean => {
    // Basic password strength check (example)
    if (pw.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return false;
    }
    // Add more checks (uppercase, lowercase, number, symbol) if needed
    setPasswordError(null);
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    // Frontend validation
    if (!validatePassword(password)) {
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);

    try {
      // Replace with actual API call
      // const userData = await registerUser({ name, email, password });

      // Mock successful registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Registration successful for:', email);

      // Redirect to login page or dashboard after registration
      // Potentially show a "Check your email for verification" message first
      navigate('/login?registered=true'); // Redirect to login with a flag

    } catch (err: any) {
      console.error('Registration failed:', err);
      // Set specific error message based on API response (e.g., email already exists)
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Start building your website today.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* General Error Message Display */}
            {error && (
              <div className="bg-destructive/15 p-3 rounded-md text-sm text-destructive">
                <p>{error}</p>
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-1">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value); // Validate on change
                }}
                required
                disabled={isLoading}
                aria-describedby="password-error"
              />
              {/* Placeholder for password strength indicator */}
              {/* <PasswordStrengthIndicator password={password} /> */}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                aria-describedby="password-error"
              />
            </div>

             {/* Password Error Message Display */}
             {passwordError && (
               <p id="password-error" className="text-sm text-destructive">{passwordError}</p>
             )}

            {/* Terms Agreement */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(Boolean(checked))}
                disabled={isLoading}
                aria-describedby="terms-label"
              />
              <Label htmlFor="terms" id="terms-label" className="text-sm text-muted-foreground">
                I agree to the{' '}
                <Link to="/terms" target="_blank" className="text-primary hover:underline">Terms of Service</Link> and{' '}
                <Link to="/privacy" target="_blank" className="text-primary hover:underline">Privacy Policy</Link>.
              </Label>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading || !agreedToTerms}>
              {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
              Create Account
            </Button>
          </form>

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
