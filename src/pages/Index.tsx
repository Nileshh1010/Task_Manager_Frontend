import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-3xl p-8 bg-card backdrop-blur-sm border-border">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-full p-3 mr-2">
              <span className="font-bold text-3xl text-white">T</span>
            </div>
            <h1 className="text-5xl font-bold text-card-foreground">Task Flow</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            The task management platform that helps you organize your work, track your time, and collaborate with your team.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            className="bg-primary hover:bg-primary/90 text-white text-lg py-6 px-8"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
          <Button 
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 text-lg py-6 px-8"
            onClick={() => navigate('/register')}
          >
            Create Account
          </Button>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-secondary rounded-lg">
            <h3 className="font-bold text-lg mb-2 text-card-foreground">Task Management</h3>
            <p className="text-muted-foreground">Organize your tasks, set priorities and deadlines.</p>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <h3 className="font-bold text-lg mb-2 text-card-foreground">Time Tracking</h3>
            <p className="text-muted-foreground">Track time spent on tasks and projects.</p>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <h3 className="font-bold text-lg mb-2 text-card-foreground">Collaboration</h3>
            <p className="text-muted-foreground">Share tasks and categories with your team.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;