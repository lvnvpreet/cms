// client/src/components/auth/RegisterForm.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Keep Link for terms/privacy
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/core/Spinner';
import { registerUser } from '@/services/authService'; // Import the actual service function

interface RegisterFormProps {
  onRegisterSuccess: () => void; // Callback for successful registration
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const [firstName, setFirstName] = useState(''); // Added firstName state
  const [lastName, setLastName] = useState(''); // Added lastName state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validatePassword = (pw: string): boolean => {
    if (pw.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

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
      // Include firstName and lastName in the data sent to the service
      const userData = await registerUser({ firstName, lastName, username, email, password });
      console.log('Registration successful:', userData);
      onRegisterSuccess(); // Call the success callback

    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* General Error Message Display */}
      {error && (
        <div className="bg-destructive/15 p-3 rounded-md text-sm text-destructive">
          <p>{error}</p>
        </div>
      )}

      {/* First Name Input */}
      <div className="space-y-1">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          type="text"
          placeholder="Your first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      {/* Last Name Input */}
      <div className="space-y-1">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          type="text"
          placeholder="Your last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      {/* Username Input */}
      <div className="space-y-1">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
            validatePassword(e.target.value);
          }}
          required
          disabled={isLoading}
          aria-describedby="password-error"
        />
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
  );
};
