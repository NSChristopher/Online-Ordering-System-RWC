import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/hooks/useOrders';
import { Order } from '@/types';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package, 
  Phone, 
  StickyNote, 
  RefreshCw,
  Bell,
  AlertTriangle
} from 'lucide-react';

const WorkerDashboard = () => {
  const { orders, loading, fetchOrders, acceptOrder, rejectOrder, markOrderReady } = useOrders();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchOrders();
      setLastRefresh(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh, fetchOrders]);

  // Categorize orders by status
  const categorizedOrders = useMemo(() => {
    const pending = orders.filter(order => order.status === 'pending');
    const accepted = orders.filter(order => order.status === 'accepted');
    const ready = orders.filter(order => order.status === 'ready');
    
    return { pending, accepted, ready };
  }, [orders]);

  // Check for urgent orders (older than 15 minutes)
  const urgentOrders = useMemo(() => {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    return orders.filter(order => 
      (order.status === 'pending' || order.status === 'accepted') &&
      new Date(order.createdAt) < fifteenMinutesAgo
    );
  }, [orders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'border-l-yellow-500 bg-yellow-50';
      case 'accepted': return 'border-l-blue-500 bg-blue-50';
      case 'ready': return 'border-l-green-500 bg-green-50';
      case 'rejected': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-6 w-6 text-yellow-600" />;
      case 'accepted': return <CheckCircle className="h-6 w-6 text-blue-600" />;
      case 'ready': return <Package className="h-6 w-6 text-green-600" />;
      case 'rejected': return <XCircle className="h-6 w-6 text-red-600" />;
      default: return <Clock className="h-6 w-6 text-gray-600" />;
    }
  };

  const getTimeElapsed = (createdAt: string) => {
    const elapsed = Date.now() - new Date(createdAt).getTime();
    const minutes = Math.floor(elapsed / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  const isUrgent = (order: Order) => {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    return (order.status === 'pending' || order.status === 'accepted') &&
           new Date(order.createdAt) < fifteenMinutesAgo;
  };

  const handleAction = async (action: () => Promise<any>) => {
    try {
      await action();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className={`${getStatusColor(order.status)} border-l-4 mb-4 shadow-lg hover:shadow-xl transition-all duration-200 ${isUrgent(order) ? 'ring-2 ring-red-400 animate-pulse' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(order.status)}
            <div>
              <CardTitle className="text-xl font-bold">#{order.id}</CardTitle>
              <p className="text-sm text-gray-600 font-medium">{order.customerName}</p>
            </div>
            {isUrgent(order) && (
              <div className="flex items-center space-x-1 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm font-medium">URGENT</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">${order.totalAmount.toFixed(2)}</p>
            <p className="text-sm text-gray-500">{getTimeElapsed(order.createdAt)}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {order.customerPhone && (
          <div className="flex items-center space-x-2 mb-3">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{order.customerPhone}</span>
          </div>
        )}
        
        {order.notes && (
          <div className="flex items-start space-x-2 mb-4">
            <StickyNote className="h-4 w-4 text-gray-500 mt-0.5" />
            <p className="text-sm bg-yellow-100 p-2 rounded">{order.notes}</p>
          </div>
        )}
        
        <div className="space-y-2 mb-4">
          <h4 className="font-medium text-gray-700">Order Items:</h4>
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm bg-white p-2 rounded border">
              <div>
                <span className="font-medium">{item.quantity}x {item.menuItemName}</span>
                {item.notes && <p className="text-gray-500 text-xs">Note: {item.notes}</p>}
              </div>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <div className="flex space-x-2">
          {order.status === 'pending' && (
            <>
              <Button 
                onClick={() => handleAction(() => acceptOrder(order.id))}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-lg py-3 h-12"
                size="lg"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Accept
              </Button>
              <Button 
                onClick={() => handleAction(() => rejectOrder(order.id))}
                variant="destructive"
                className="flex-1 text-lg py-3 h-12"
                size="lg"
              >
                <XCircle className="h-5 w-5 mr-2" />
                Reject
              </Button>
            </>
          )}
          
          {order.status === 'accepted' && (
            <Button 
              onClick={() => handleAction(() => markOrderReady(order.id))}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3 h-12"
              size="lg"
            >
              <Package className="h-5 w-5 mr-2" />
              Mark Ready
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Kitchen Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage incoming orders in real-time</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {urgentOrders.length > 0 && (
            <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-lg">
              <Bell className="h-5 w-5" />
              <span className="font-medium">{urgentOrders.length} Urgent</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            <span>Last update: {lastRefresh.toLocaleTimeString()}</span>
          </div>
          
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
          >
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          
          <Button onClick={() => fetchOrders()} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-500" />
          <p className="text-gray-500 text-lg">Loading orders...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Orders */}
          <div>
            <h2 className="text-2xl font-bold text-yellow-700 mb-4 flex items-center">
              <Clock className="h-6 w-6 mr-2" />
              Pending ({categorizedOrders.pending.length})
            </h2>
            {categorizedOrders.pending.length === 0 ? (
              <Card className="p-6 text-center text-gray-500">
                <p>No pending orders</p>
              </Card>
            ) : (
              categorizedOrders.pending.map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </div>

          {/* Accepted Orders */}
          <div>
            <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
              <CheckCircle className="h-6 w-6 mr-2" />
              In Progress ({categorizedOrders.accepted.length})
            </h2>
            {categorizedOrders.accepted.length === 0 ? (
              <Card className="p-6 text-center text-gray-500">
                <p>No orders in progress</p>
              </Card>
            ) : (
              categorizedOrders.accepted.map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </div>

          {/* Ready Orders */}
          <div>
            <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center">
              <Package className="h-6 w-6 mr-2" />
              Ready ({categorizedOrders.ready.length})
            </h2>
            {categorizedOrders.ready.length === 0 ? (
              <Card className="p-6 text-center text-gray-500">
                <p>No ready orders</p>
              </Card>
            ) : (
              categorizedOrders.ready.map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerDashboard;