
import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-purple-600 rounded-full p-2 mr-2">
            <span className="font-bold text-xl text-white">T</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Task Flow</h1>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
