import React, { useState, useEffect } from 'react';
import { RefreshCw, Bell, Filter, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import OrderCard from '../components/OrderCard';
import { useOrders } from '../hooks/useOrders';
import { OrderStatus } from '../types';

const Dashboard: React.FC = () => {
  const {
    orders,
    loading,
    error,
    fetchOrders,
    acceptOrder,
    rejectOrder,
    markOrderReady,
    markOrderPreparing,
    getOrdersByStatus,
  } = useOrders();

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Update last refresh time when orders are fetched
  useEffect(() => {
    if (!loading) {
      setLastRefresh(new Date());
    }
  }, [loading]);

  // Get filtered orders based on selected status
  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : getOrdersByStatus(selectedStatus);

  // Get counts for different statuses
  const statusCounts = {
    new: getOrdersByStatus('new').length,
    accepted: getOrdersByStatus('accepted').length,
    preparing: getOrdersByStatus('preparing').length,
    ready: getOrdersByStatus('ready').length,
  };

  const handleRefresh = async () => {
    await fetchOrders();
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'all': return 'All Orders';
      case 'new': return 'New Orders';
      case 'accepted': return 'Accepted';
      case 'preparing': return 'Preparing';
      case 'ready': return 'Ready';
      default: return status;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">⚠️ Error Loading Orders</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Worker Dashboard</h1>
              <p className="text-sm text-gray-600">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {statusCounts.new > 0 && (
                <div className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full">
                  <Bell className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">{statusCounts.new} new</span>
                </div>
              )}
              <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-800">{statusCounts.new}</div>
              <div className="text-sm text-yellow-600">New Orders</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-800">{statusCounts.accepted}</div>
              <div className="text-sm text-blue-600">Accepted</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-800">{statusCounts.preparing}</div>
              <div className="text-sm text-orange-600">Preparing</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-800">{statusCounts.ready}</div>
              <div className="text-sm text-green-600">Ready</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'new', 'accepted', 'preparing', 'ready'].map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus(status as OrderStatus | 'all')}
                className="text-sm"
              >
                {getStatusDisplayName(status)}
                {status !== 'all' && (
                  <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                    {status === 'new' ? statusCounts.new :
                     status === 'accepted' ? statusCounts.accepted :
                     status === 'preparing' ? statusCounts.preparing :
                     status === 'ready' ? statusCounts.ready : 0}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Orders Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Loading orders...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {selectedStatus === 'all' ? '' : selectedStatus + ' '}orders found
            </h3>
            <p className="text-gray-600">
              {selectedStatus === 'all' 
                ? 'No orders have been placed yet.' 
                : `No orders with status "${selectedStatus}" at the moment.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAccept={acceptOrder}
                onReject={rejectOrder}
                onMarkReady={markOrderReady}
                onMarkPreparing={markOrderPreparing}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;