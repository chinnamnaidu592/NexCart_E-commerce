'use client';

import React, { useState, useEffect } from 'react';
import TimeRangeFilter from '@/components/admin/analytics/TimeRangeFilter';
import ExecutiveKpis from '@/components/admin/analytics/ExecutiveKpis';
import RevenueAnalyticsChart from '@/components/admin/analytics/RevenueAnalyticsChart';
import CategorySalesAnalytics from '@/components/admin/analytics/CategorySalesAnalytics';
import ConversionFunnelAnalytics from '@/components/admin/analytics/ConversionFunnelAnalytics';
import TopProductsAnalytics from '@/components/admin/analytics/TopProductsAnalytics';
import FulfillmentAnalytics from '@/components/admin/analytics/FulfillmentAnalytics';
import RecentOrdersTable from '@/components/admin/RecentOrdersTable';
import Loader from '@/components/common/Loader';
import { orderService } from '@/services/orderService';
import { productService } from '@/services/productService';
import { userService } from '@/services/userService';
import { analyticsService } from '@/services/analyticsService';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  const loadData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        orderService.getOrders(),
        productService.getAllProducts(),
      ]);

      setOrders(ordersRes || []);
      setProducts(productsRes.products || []);
      setLastUpdated(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    } catch (err) {
      console.error('Failed fetching merchant dashboard analytics:', err);
      toast.error('Could not load store analytics telemetry.');
    } finally {
      if (showLoading) setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(true);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData(false);
    toast.success('Store analytics synchronized with latest receipts.');
  };

  // Derive analytics payload based on current orders, products, and selected time range
  const analytics = analyticsService.getAnalyticsData({
    orders,
    products,
    timeRange,
  });

  const handleExportCsv = () => {
    try {
      analyticsService.exportAnalyticsCsv(analytics);
      toast.success(`Exported ${analytics.periodLabel} CSV report.`);
    } catch (err) {
      console.error('Failed exporting analytics CSV:', err);
      toast.error('Unable to generate CSV export.');
    }
  };

  if (loading) {
    return <Loader message="Compiling executive merchant analytics and transaction volume..." />;
  }

  return (
    <div className="space-y-8 text-left pb-12">
      {/* Time Horizon Selector & Action Toolbar */}
      <TimeRangeFilter
        selectedRange={timeRange}
        onRangeChange={(range) => setTimeRange(range)}
        onExportCsv={handleExportCsv}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
      />

      {/* 8 Executive KPIs (4 Financial Drivers + 4 Operational Telemetry) */}
      <ExecutiveKpis metrics={analytics.metrics} />

      {/* Primary Visual Chart: Revenue & Order Trajectory with Multi-Mode View */}
      <RevenueAnalyticsChart
        chartData={analytics.chartData}
        timeRange={timeRange}
      />

      {/* Two-Column Deep-Dive Analytics (Category Sales + Conversion Funnel) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <CategorySalesAnalytics categories={analytics.categories} />
        <ConversionFunnelAnalytics
          funnelData={analytics.funnelData}
          paymentMethods={analytics.paymentMethods}
        />
      </div>

      {/* Logistics & Order Fulfillment Pipeline */}
      <FulfillmentAnalytics orders={orders} />

      {/* Best-Selling SKUs & Inventory Health Matrix */}
      <TopProductsAnalytics products={analytics.topProducts} />

      {/* Recent Dispatches & Transaction Manifests */}
      <RecentOrdersTable orders={orders} />
    </div>
  );
}
