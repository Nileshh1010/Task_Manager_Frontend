import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '../context/AuthContext';  // Update the import path
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F16] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-purple-600 rounded-full p-3 mr-3">
            <span className="font-bold text-2xl text-white">T</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Task Flow</h1>
        </div>

        <Card className="bg-[#1A1F2B] border-[#2A2F3B]">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-center text-white mb-2">Log In to Task Flow</h2>
            <p className="text-[#8F95A1] text-center mb-6">Enter your credentials to access your account</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#13171F] border-[#2A2F3B] text-white placeholder:text-[#4A5260] h-12"
                required
              />
              
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#13171F] border-[#2A2F3B] text-white placeholder:text-[#4A5260] h-12"
                required
              />

              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              <p className="text-center text-[#8F95A1] text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-purple-400 hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
