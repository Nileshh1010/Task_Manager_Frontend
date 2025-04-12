
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mb-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-purple-600 rounded-full p-3 mr-3">
            <span className="font-bold text-2xl text-white">T</span>
          </div>
          <h1 className="text-4xl font-bold text-white">Task Flow</h1>
        </div>
        
        <div className="space-y-6 mt-8">
          <h2 className="text-3xl font-bold text-white">Task Management Made Simple</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Organize your tasks, collaborate with your team, and boost your productivity with Task Flow.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg h-auto">
              <Link to="/login">Get Started</Link>
            </Button>
            <Button asChild variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-900/20 px-8 py-6 text-lg h-auto">
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-3">Task Management</h3>
            <p className="text-gray-300">Create, organize, and track your tasks with ease.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-3">Collaboration</h3>
            <p className="text-gray-300">Work together with your team in real-time.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-3">Analytics</h3>
            <p className="text-gray-300">Track progress and improve productivity with insights.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
