
import React, { useEffect, useState } from 'react';
import { CalendarDays, Plus } from 'lucide-react';
import { taskService, categoryService, trackingService } from '@/services/apiService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";

// Mock data - replace with real data from API
const monthData = {
  month: "March",
  year: 2022,
  days: Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    date: new Date(2022, 2, i + 1)
  }))
};

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

interface Category {
  id: string;
  name: string;
  users: { id: string; username: string }[];
}

interface Tracking {
  id: string;
  title: string;
  duration: string;
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [trackings, setTrackings] = useState<Tracking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [tasksData, categoriesData, trackingsData] = await Promise.all([
          taskService.getAllTasks(),
          categoryService.getAllCategories(),
          trackingService.getAllTrackings()
        ]);
        
        setTasks(tasksData);
        setCategories(categoriesData);
        setTrackings(trackingsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
          <Plus className="h-4 w-4 mr-2" />
          New task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendar Section */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>{monthData.month} {monthData.year}</CardTitle>
              <div className="flex space-x-1">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <CalendarDays className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 text-center text-xs font-medium">
              <div>Mo</div>
              <div>Tu</div>
              <div>We</div>
              <div>Th</div>
              <div>Fr</div>
              <div>Sa</div>
              <div>Su</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mt-2">
              {[...Array(31)].map((_, index) => {
                const day = index + 1;
                const isActiveDay = day === 3;

                return (
                  <div
                    key={day}
                    className={`p-2 rounded-full text-sm ${
                      isActiveDay
                        ? "bg-yellow-400 text-black font-bold"
                        : "hover:bg-gray-100 cursor-pointer"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tasks Section */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>My tasks (05)</CardTitle>
              <Button variant="ghost" size="sm" className="text-gray-500">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-8 bg-gray-100 rounded animate-pulse" />
                <div className="h-8 bg-gray-100 rounded animate-pulse" />
                <div className="h-8 bg-gray-100 rounded animate-pulse" />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 py-2">
                  <div className="bg-yellow-100 border border-yellow-300 rounded-full p-0.5">
                    <svg className="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="line-through text-gray-500">Finish monthly reporting</span>
                  <span className="ml-auto text-xs text-yellow-600 font-medium">Today</span>
                </div>
                <div className="flex items-center space-x-2 py-2">
                  <div className="bg-white border border-gray-300 rounded-full p-0.5">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Contract signing</span>
                  <span className="ml-auto text-xs text-yellow-600 font-medium">Today</span>
                </div>
                <div className="flex items-center space-x-2 py-2">
                  <div className="bg-white border border-gray-300 rounded-full p-0.5">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Market overview keynote</span>
                  <span className="ml-auto text-xs text-gray-500">Tomorrow</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categories Section */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>My categories</CardTitle>
              <Button variant="ghost" size="sm" className="text-gray-500">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-10 bg-gray-100 rounded animate-pulse" />
                <div className="h-10 bg-gray-100 rounded animate-pulse" />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span>Work</span>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="h-6 w-6 rounded-full bg-blue-500 border-2 border-white"></div>
                    <div className="h-6 w-6 rounded-full bg-green-500 border-2 border-white"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span>Family</span>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="h-6 w-6 rounded-full bg-red-500 border-2 border-white"></div>
                    <div className="h-6 w-6 rounded-full bg-yellow-500 border-2 border-white"></div>
                    <div className="h-6 w-6 rounded-full bg-green-500 border-2 border-white"></div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tracking Section */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>My tracking</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-10 bg-gray-100 rounded animate-pulse" />
                <div className="h-10 bg-gray-100 rounded animate-pulse" />
                <div className="h-10 bg-gray-100 rounded animate-pulse" />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <CalendarDays className="h-4 w-4 text-gray-600" />
                    </div>
                    <span>Create wireframe</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">1h 25m 30s</span>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Play</span>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <CalendarDays className="h-4 w-4 text-gray-600" />
                    </div>
                    <span>Slack logo design</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">30m 18s</span>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Play</span>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
