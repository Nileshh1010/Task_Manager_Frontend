import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  user_id: number;
}

interface TaskFormProps {
  onTaskCreated: (taskData: any) => Promise<void>;
  categories: Category[];
  onCategoryAdded: (category: Category) => void;
  className?: string;
}

interface TaskFormData {
  title: string;
  priority: string;
  deadline: string;
  category_id: string;
}

const TaskForm = ({ onTaskCreated, categories, onCategoryAdded, className }: TaskFormProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const { control, handleSubmit, reset } = useForm<TaskFormData>({
    defaultValues: {
      title: '',
      priority: 'Medium',
      deadline: '',
      category_id: ''
    }
  });
  const { toast } = useToast();

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

      onCategoryAdded(result.category);
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

  const onSubmit = async (data: TaskFormData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch('http://127.0.0.1:8000/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: data.title,
          priority: data.priority,
          deadline: data.deadline,
          category_id: Number(data.category_id)
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create task');
      }

      // Call onTaskCreated with the new task data
      await onTaskCreated(result.task);
      setIsOpen(false);
      reset();
      
      toast({
        title: "Success",
        description: result.message
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create task',
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={className || "bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-none"}>
          + New task
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1A1F2B] border-[#2A2F3B] text-white">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Title</label>
            <Controller
              name="title"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  className="bg-[#13171F] border-[#2A2F3B] text-white"
                  placeholder="Enter task title"
                />
              )}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Category</label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsAddingCategory(!isAddingCategory)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 w-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {isAddingCategory ? (
              <div className="flex gap-2">
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="bg-[#13171F] border-[#2A2F3B] text-white"
                  placeholder="Enter category name"
                />
                <Button
                  type="button"
                  onClick={handleAddCategory}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Add
                </Button>
              </div>
            ) : (
              <Controller
                name="category_id"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="bg-[#13171F] border-[#2A2F3B] text-white">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1F2B] border-[#2A2F3B]">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Priority</label>
            <Controller
              name="priority"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="bg-[#13171F] border-[#2A2F3B] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1F2B] border-[#2A2F3B]">
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Deadline</label>
            <Controller
              name="deadline"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  type="date"
                  {...field}
                  className="bg-[#13171F] border-[#2A2F3B] text-white"
                />
              )}
            />
          </div>

          <Button 
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Create Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;