import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: number;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  status: 'Upcoming' | 'In Progress' | 'Completed';
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/tasks/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async (taskId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/tasks/${taskId}/complete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to complete task');
      }

      // Update local state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: 'Completed' } : task
        )
      );

      toast({
        title: "Success",
        description: "Task marked as completed",
      });
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: "Error",
        description: "Failed to complete task",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <p className="text-center text-gray-400">No tasks available</p>
              ) : (
                tasks.map(task => (
                  <div 
                    key={task.id} 
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                  >
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{task.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-400">
                          Due: {new Date(task.deadline).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          task.priority === 'High' ? 'bg-red-500/20 text-red-300' :
                          task.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {task.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          task.status === 'Completed' ? 'bg-green-500/20 text-green-300' :
                          task.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                    
                    {task.status !== 'Completed' && (
                      <Button
                        onClick={() => handleComplete(task.id)}
                        variant="ghost"
                        size="sm"
                        className="ml-4 hover:bg-green-500/20"
                      >
                        <Check className="h-5 w-5 text-green-400" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Tasks;