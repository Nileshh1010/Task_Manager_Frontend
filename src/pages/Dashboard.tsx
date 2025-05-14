import React, { useEffect, useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import TaskForm from '@/components/tasks/TaskForm';
import { taskService, categoryService, trackingService } from '@/services/apiService';
import { Check as CheckIcon, Trash as TrashIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const monthData = {
  month: "March",
  year: 2022,
  days: Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    date: new Date(2022, 2, i + 1)
  }))
};

interface Task {
  id: number;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  category_id: number;
  status: 'Upcoming' | 'In Progress' | 'Completed';
}

interface Category {
  id: number;  // Changed from string to number to match backend
  name: string;
  user_id: number;  // Added to match backend
}

interface Tracking {
  id: string;
  taskId: number;
  title: string;
  duration: string;
  status: string;
}

interface TrackingHistory {
  changed_at: string;
  from: string;
  to: string;
  task_id: number;
  title: string;
}

const Dashboard = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [trackings, setTrackings] = useState<Tracking[]>([]);
  const [trackingHistory, setTrackingHistory] = useState<TrackingHistory[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'Medium',
    deadline: '',
    category_id: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchTaskTracking = async (taskId?: number) => {
    try {
      if (!taskId && !selectedTaskId) return;
      const targetTaskId = taskId || selectedTaskId!;
      
      const history = await trackingService.getTrackingHistory(targetTaskId);
      setTrackingHistory(history);
    } catch (error) {
      console.error('Error fetching task tracking:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load task history",
        variant: "destructive"
      });
      setTrackingHistory([]);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAllTasks(),
        categoryService.getAllCategories(),
      ]);

      setTasks(tasksData);
      setCategories(categoriesData);
      
      // Only fetch tracking if there's a selected task
      if (selectedTaskId) {
        await fetchTaskTracking(selectedTaskId);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [toast]);

  const handleTaskSelection = async (taskId: number) => {
    try {
      setSelectedTaskId(taskId);
      const history = await trackingService.getTrackingHistory(taskId);
      setTrackingHistory(history);
    } catch (error) {
      console.error('Error fetching task tracking:', error);
      toast({
        title: "Error",
        description: "Failed to load task history",
        variant: "destructive"
      });
    }
  };

  const handleTrackStatus = async (taskId: number, status: string) => {
    try {
      await trackingService.trackStatus(taskId, { status });
      await fetchTaskTracking(taskId);
      toast({
        title: "Success",
        description: "Task status updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive"
      });
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newTask,
          category_id: parseInt(newTask.category_id),
          status: 'Upcoming'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: data.message,
      });
      
      // Reset form and close dialog
      setNewTask({ title: '', priority: 'Medium', deadline: '', category_id: '' });
      setIsDialogOpen(false);
      // Refresh tasks
      fetchTasks();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCategory = async () => {
    try {
      const name = prompt('Enter category name:');
      if (!name) return;

      const newCategory = await categoryService.createCategory(name);
      setCategories(prevCategories => [...prevCategories, newCategory]);
      toast({
        title: "Success",
        description: "Category created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive"
      });
    }
  };

  const handleTaskComplete = async (taskId: number) => {
    try {
      await taskService.completeTask(taskId);
      
      // Update task status locally
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, status: 'Completed' as const }
            : task
        )
      );

      // Store completed status in localStorage
      const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
      if (!completedTasks.includes(taskId)) {
        completedTasks.push(taskId);
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
      }

      // Refresh tracking history
      await fetchTaskTracking(taskId);

      toast({
        title: "Success",
        description: "Task marked as complete"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete task",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await taskService.deleteTask(taskId);
      // Remove the deleted task from state
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      toast({
        title: "Success",
        description: "Task deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive"
      });
    }
  };

  const handleTaskCreated = async (newTask: any) => {
    // Update tasks list with the new task
    setTasks(prevTasks => [...prevTasks, newTask]);
    // Optionally refresh the entire tasks list
    await fetchTasks();
  };

  const handleCategoryAdded = (newCategory: Category) => {
    setCategories(prevCategories => [...prevCategories, newCategory]);
  };

  const TrackingHistorySection = () => (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Status History</CardTitle>
      </CardHeader>
      <CardContent>
        {trackingHistory.length === 0 ? (
          <div className="text-center text-gray-500">No status changes recorded</div>
        ) : (
          <div className="space-y-2">
            {trackingHistory.map((entry, index) => (
              <div 
                key={`${entry.task_id}-${index}`}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{entry.title}</span>
                  <span className="text-xs text-gray-600">
                    {entry.from} → {entry.to}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(entry.changed_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <TaskForm 
          onTaskCreated={handleTaskCreated}
          categories={categories}
          onCategoryAdded={handleCategoryAdded}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Calendar Card */}
        <Card className="bg-[#1A1F2B] border-[#2A2F3B]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-xl">March 2022</CardTitle>
              <Button variant="ghost" size="icon">
                <Calendar className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                <div key={day} className="text-sm text-gray-400">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {monthData.days.map(({ day, date }) => (
                <div
                  key={day}
                  className={`p-2 rounded-md ${
                    day === 3 ? 'bg-yellow-500 text-black' :
                    day === 20 ? 'bg-gray-700' :
                    'hover:bg-gray-700'
                  } cursor-pointer text-sm`}
                >
                  {day}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tasks List Card */}
        <Card className="bg-[#1A1F2B] border-[#2A2F3B]">
          <CardHeader>
            <CardTitle className="text-white text-xl">My tasks (02)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="h-8 bg-slate-800/50 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                    onClick={() => handleTaskSelection(task.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        task.priority === 'High' ? 'bg-red-500' : 
                        task.priority === 'Medium' ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`} />
                      <span className={`text-slate-200 ${task.status === 'Completed' ? 'line-through text-slate-500' : ''}`}>
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-slate-400">{new Date(task.deadline).toLocaleDateString()}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        task.status === 'Completed' ? 'bg-green-900/50 text-green-300' :
                        task.status === 'In Progress' ? 'bg-yellow-900/50 text-yellow-300' :
                        'bg-blue-900/50 text-blue-300'
                      }`}>
                        {task.status}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskComplete(task.id);
                          }}
                          className="text-green-400 hover:text-green-300"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task.id);
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Categories Card */}
        <Card className="bg-[#1A1F2B] border-[#2A2F3B]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-xl">My categories (03)</CardTitle>
              <Button variant="ghost" size="icon">
                <Plus className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-[#13171F] rounded-lg"
                >
                  <span className="text-white">{category.name}</span>
                  <span className="text-gray-400 text-sm">0 tasks</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status History Card */}
        <Card className="bg-[#1A1F2B] border-[#2A2F3B] md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white text-xl">Status History</CardTitle>
          </CardHeader>
          <CardContent>
            {trackingHistory.length === 0 ? (
              <div className="text-center text-gray-500">
                No status changes recorded
              </div>
            ) : (
              <div className="space-y-2">
                {trackingHistory.map((entry, index) => (
                  <div 
                    key={`${entry.task_id}-${index}`}
                    className="flex items-center justify-between p-2 bg-[#13171F] rounded-lg"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">
                        {entry.title}
                      </span>
                      <span className="text-xs text-gray-400">
                        {entry.from} → {entry.to}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(entry.changed_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
