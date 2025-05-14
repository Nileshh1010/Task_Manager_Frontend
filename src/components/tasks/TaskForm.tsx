import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface TaskFormProps {
  onTaskCreated: (taskData: any) => Promise<void>;
  categories: Category[];
  onCategoryAdded: (category: Category) => void;
}

interface TaskFormData {
  title: string;
  priority: string;
  deadline: string;
  category_id: string;
}

const TaskForm = ({ onTaskCreated, categories, onCategoryAdded }: TaskFormProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { control, handleSubmit, reset } = useForm<TaskFormData>({
    defaultValues: {
      title: '',
      priority: 'Medium',
      deadline: '',
      category_id: ''
    }
  });
  const { toast } = useToast();

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
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
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
            <label className="text-sm text-gray-400">Category</label>
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
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            Create Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;