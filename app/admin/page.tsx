import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import db from '../db/db';
import { formatCurrency, formatNumber } from '@/lib/formaters';
import { cn } from '@/lib/utils';

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true
  });

  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count
  };
}

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true }
    })
  ]);

  return {
    userCount,
    averageValuePerUser:
      userCount === 0 ? 0 : (orderData._sum.pricePaidInCents || 0) / userCount / 100
  };
}

async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: true } })
  ]);

  return { activeCount, inactiveCount };
}

const AdminDashboard = async () => {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData()
  ]);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      <DashboardCard
        title='Sales'
        subtitle={cn('', formatNumber(salesData.numberOfSales))}
        body={cn('', formatCurrency(salesData.amount))}
      />
      <DashboardCard
        title='Customers'
        subtitle={cn('', formatCurrency(userData.averageValuePerUser), 'Average value')}
        body={cn('', formatNumber(userData.userCount))}
      />
      <DashboardCard
        title='Active Products '
        subtitle={cn('', formatNumber(productData.inactiveCount), 'Inactive')}
        body={cn('', formatNumber(productData.activeCount))}
      />
    </div>
  );
};

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription> {subtitle}</CardDescription>
      </CardHeader>
      <CardContent>{<p>{body}</p>}</CardContent>
    </Card>
  );
}
export default AdminDashboard;
