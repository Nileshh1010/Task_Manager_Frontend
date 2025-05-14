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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [trackingHistory, setTrackingHistory] = useState<TrackingHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Get current date
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();

  const monthData = {
    month: currentMonth,
    year: currentYear,
    days: Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      date: new Date(currentYear, currentDate.getMonth(), i + 1)
    }))
  };

  // Load tracking history from localStorage on mount
  useEffect(() => {
    const loadTrackingHistory = () => {
      try {
        const savedHistory = localStorage.getItem('trackingHistory');
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory);
          if (Array.isArray(parsedHistory)) {
            setTrackingHistory(parsedHistory);
          }
        }
      } catch (error) {
        console.error('Error loading tracking history:', error);
        setTrackingHistory([]);
      }
    };
    loadTrackingHistory();
  }, []);

  // Save tracking history to localStorage whenever it changes
  useEffect(() => {
    try {
      if (trackingHistory.length > 0) {
        localStorage.setItem('trackingHistory', JSON.stringify(trackingHistory));
      }
    } catch (error) {
      console.error('Error saving tracking history:', error);
    }
  }, [trackingHistory]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://127.0.0.1:8000/tasks/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
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

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://127.0.0.1:8000/categories/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      });
    }
  };

  const fetchTrackingHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://127.0.0.1:8000/tracking/history/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // If the endpoint doesn't exist, just set empty history
        if (response.status === 404) {
          setTrackingHistory([]);
          return;
        }
        throw new Error('Failed to fetch tracking history');
      }

      const data = await response.json();
      setTrackingHistory(data.history || []);
    } catch (error) {
      console.error('Error fetching tracking history:', error);
      // Set empty history on error
      setTrackingHistory([]);
      toast({
        title: "Error",
        description: "Failed to load tracking history",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchCategories();
    fetchTrackingHistory();
  }, []);

  const handleTaskCreated = async (newTask: Task) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleCategoryAdded = async (newCategory: Category) => {
    setCategories(prevCategories => [...prevCategories, newCategory]);
  };

  const handleTaskSelection = (taskId: number) => {
    // Implement task selection logic here
    console.log('Task selected:', taskId);
  };

  const handleTaskComplete = async (taskId: number) => {
    try {
      await taskService.completeTask(taskId);
      
      // Update tasks list
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: 'Completed' } : task
        )
      );

      // Create new tracking history entry
      const completedTask = tasks.find(task => task.id === taskId);
      if (completedTask) {
        const newHistoryEntry: TrackingHistory = {
          changed_at: new Date().toISOString(),
          from: 'In Progress',
          to: 'Completed',
          task_id: taskId,
          title: completedTask.title
        };

        setTrackingHistory(prevHistory => {
          const updatedHistory = [newHistoryEntry, ...prevHistory];
          return updatedHistory;
        });
      }

      toast({
        title: "Success",
        description: "Task marked as completed",
      });
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to complete task",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await taskService.deleteTask(taskId);
      
      // Update tasks list by removing the deleted task
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));

      // Remove any tracking history entries for this task
      setTrackingHistory(prevHistory => {
        const updatedHistory = prevHistory.filter(entry => entry.task_id !== taskId);
        return updatedHistory;
      });

      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete task",
        variant: "destructive"
      });
    }
  };

  const handleAddCategory = async () => {
    try {
      if (!newCategoryName.trim()) {
        toast({
          title: "Error",
          description: "Category name cannot be empty",
          variant: "destructive"
        });
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch('http://127.0.0.1:8000/categories/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCategoryName.trim() })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create category');
      }

      setCategories(prevCategories => [...prevCategories, result.category]);
      setNewCategoryName('');
      setIsAddingCategory(false);
      
      toast({
        title: "Success",
        description: "Category created successfully"
      });
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create category',
        variant: "destructive"
      });
    }
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
          className="bg-purple-600 rounded-full p-2 hover:bg-purple-700 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Calendar Card */}
        <Card className="bg-[#1A1F2B] border-[#2A2F3B]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-xl">{monthData.month} {monthData.year}</CardTitle>
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
              {monthData.days.map(({ day, date }) => {
                const isToday = date.toDateString() === new Date().toDateString();
                const tasksForDay = tasks.filter(task => {
                  const taskDate = new Date(task.deadline);
                  return taskDate.toDateString() === date.toDateString();
                });

                // Determine the highest priority task for the day
                const getPriorityColor = () => {
                  if (tasksForDay.length === 0) return '';
                  
                  const hasHighPriority = tasksForDay.some(task => task.priority === 'High');
                  const hasMediumPriority = tasksForDay.some(task => task.priority === 'Medium');
                  
                  if (hasHighPriority) return 'bg-red-700';
                  if (hasMediumPriority) return 'bg-orange-700';
                  return 'bg-green-700';
                };
                
                return (
                  <div
                    key={day}
                    className={`p-2 rounded-md ${
                      isToday ? 'bg-yellow-500 text-black' :
                      tasksForDay.length > 0 ? getPriorityColor() :
                      'hover:bg-gray-700'
                    } cursor-pointer text-sm relative group`}
                  >
                    {day}
                    {tasksForDay.length > 0 && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white opacity-75" />
                    )}
                    {tasksForDay.length > 0 && (
                      <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded-md shadow-lg z-10 min-w-[200px] -translate-x-1/2 left-1/2 top-full mt-1">
                        <div className="text-xs font-medium mb-1">Tasks for {date.toLocaleDateString()}:</div>
                        {tasksForDay.map(task => (
                          <div key={task.id} className="text-xs py-1 border-t border-gray-700">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                task.priority === 'High' ? 'bg-red-500' :
                                task.priority === 'Medium' ? 'bg-orange-500' :
                                'bg-green-500'
                              }`} />
                              <span>{task.title}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
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
              <CardTitle className="text-white text-xl">My categories ({categories.length})</CardTitle>
              <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                  >
                    <Plus className="h-5 w-5 text-gray-400" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1A1F2B] border-[#2A2F3B] text-white">
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Category Name</label>
                      <Input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="bg-[#13171F] border-[#2A2F3B] text-white"
                        placeholder="Enter category name"
                      />
                    </div>
                    <Button
                      onClick={handleAddCategory}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Add Category
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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
