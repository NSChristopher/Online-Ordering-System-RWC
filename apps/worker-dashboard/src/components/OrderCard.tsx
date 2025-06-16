import React from 'react';
import { Clock, Phone, MapPin, Package, CheckCircle, XCircle, ChefHat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Order } from '../types';

interface OrderCardProps {
  order: Order;
  onAccept: (orderId: number) => void;
  onReject: (orderId: number) => void;
  onMarkReady: (orderId: number) => void;
  onMarkPreparing: (orderId: number) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onAccept,
  onReject,
  onMarkReady,
  onMarkPreparing,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';  
      case 'preparing':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const orderTime = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const hours = Math.floor(diffInMinutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const renderStatusActions = () => {
    switch (order.status) {
      case 'new':
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => onAccept(order.id)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Accept
            </Button>
            <Button
              onClick={() => onReject(order.id)}
              variant="destructive"
              className="flex-1"
              size="sm"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        );
      case 'accepted':
        return (
          <Button
            onClick={() => onMarkPreparing(order.id)}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            size="sm"
          >
            <ChefHat className="w-4 h-4 mr-2" />
            Start Preparing
          </Button>
        );
      case 'preparing':
        return (
          <Button
            onClick={() => onMarkReady(order.id)}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <Package className="w-4 h-4 mr-2" />
            Mark Ready
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mb-4 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">
              Order #{order.id}
            </CardTitle>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Clock className="w-4 h-4 mr-1" />
              {getTimeAgo(order.createdAt)}
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
            {order.status.toUpperCase()}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Customer Info */}
        <div className="space-y-2">
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2 text-gray-500" />
            <span className="text-sm font-medium">{order.customerName}</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 ml-6">{order.customerPhone}</span>
          </div>
          {order.deliveryAddress && (
            <div className="flex items-start">
              <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
              <span className="text-sm text-gray-600">{order.deliveryAddress}</span>
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Order Type:</span>
            <span className="text-sm capitalize">{order.orderType}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total:</span>
            <span className="text-lg font-bold text-green-600">${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Order Items */}
        {order.orderItems && order.orderItems.length > 0 && (
          <div className="border-t pt-3">
            <h4 className="text-sm font-medium mb-2">Items:</h4>
            <div className="space-y-1">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.itemNameAtOrder}</span>
                  <span>${(item.priceAtOrder * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2">
          {renderStatusActions()}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;