import React, { useEffect, useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';

interface Notification {
  id: number;
  message: string;
  timestamp: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [message, setMessage] = useState('');
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/notifications/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive"
      });
    }
  };

  const addReminder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/notifications/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message,
          timestamp: date?.toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchNotifications();
      setMessage('');
      setDate(undefined);
      toast({
        title: "Success",
        description: "Reminder added successfully"
      });
    } catch (error) {
      console.error('Error adding reminder:', error);
      toast({
        title: "Error",
        description: "Failed to add reminder",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications & Reminders</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Card - Add Reminder Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Reminder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Enter reminder message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button onClick={addReminder}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Reminder
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Second Card - Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <p className="text-center text-gray-500">No reminders yet</p>
              ) : notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{notification.message}</p>
                    <time className="text-sm text-gray-500">
                      {format(new Date(notification.timestamp), 'PPp')}
                    </time>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;