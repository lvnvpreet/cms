import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Use useNavigate for redirection
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/core/Spinner';
// import { useAuth } from '@/hooks/useAuth'; // Placeholder for auth context/hook
// import { loginUser } from '@/services/authService'; // Placeholder for auth service

const LoginPage: React.FC = () => {
  // const { login } = useAuth(); // Get login function from auth context
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Replace with actual API call
      // const userData = await loginUser({ email, password });
      // await login(userData, rememberMe); // Update auth state via context

      // Mock successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login successful for:', email);

      // Redirect to dashboard or intended page after login
      navigate('/dashboard'); // Or redirect to previous location if stored

    } catch (err: any) {
      console.error('Login failed:', err);
      // Set specific error message based on API response if possible
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Access your CMS dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message Display */}
            {error && (
              <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
                <p>{error}</p>
              </div>
            )}

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
              <div className="flex justify-between items-center">
                 <Label htmlFor="password">Password</Label>
                 <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                   Forgot password?
                 </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* Remember Me (Optional) */}
            {/* <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                disabled={isLoading}
              />
              <Label htmlFor="rememberMe">Remember me</Label>
            </div> */}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
              Login
            </Button>
          </form>

          {/* Social Logins (Optional) */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
             {/* Placeholder for social login buttons */}
             {/* <p>Or continue with:</p> */}
             {/* <div className="flex justify-center gap-4 mt-2"> */}
               {/* <Button variant="outline" disabled={isLoading}>Google</Button> */}
               {/* <Button variant="outline" disabled={isLoading}>GitHub</Button> */}
             {/* </div> */}
          </div>

          {/* Link to Register Page */}
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
