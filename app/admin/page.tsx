import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

const AdminDashboard = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
      <Card>
        <CardHeader>
          <CardTitle>Sales</CardTitle>
          <CardDescription> Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Text</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
