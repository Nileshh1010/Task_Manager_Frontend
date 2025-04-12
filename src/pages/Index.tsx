
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-300 to-yellow-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-3xl p-8 bg-white/90 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-yellow-400 rounded-full p-3 mr-2">
              <span className="font-bold text-3xl">O</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-800">Organizo</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            The task management platform that helps you organize your work, track your time, and collaborate with your team.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            className="bg-yellow-400 hover:bg-yellow-500 text-black text-lg py-6 px-8"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
          <Button 
            variant="outline"
            className="border-yellow-400 text-yellow-700 hover:bg-yellow-50 text-lg py-6 px-8"
            onClick={() => navigate('/register')}
          >
            Create Account
          </Button>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Task Management</h3>
            <p className="text-gray-600">Organize your tasks, set priorities and deadlines.</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Time Tracking</h3>
            <p className="text-gray-600">Track time spent on tasks and projects.</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Collaboration</h3>
            <p className="text-gray-600">Share tasks and categories with your team.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;
