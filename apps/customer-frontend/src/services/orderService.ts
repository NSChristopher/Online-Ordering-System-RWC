// Mock service for order history and user management
import { Order, OrderItem } from './menuService';

export interface OrderHistory extends Order {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock order history data
const mockOrderHistory: OrderHistory[] = [
  {
    id: 1001,
    customerName: "John Doe",
    customerPhone: "(555) 123-4567",
    customerEmail: "john@example.com",
    orderType: "delivery",
    deliveryAddress: "123 Main St, Anytown, ST 12345",
    total: 32.97,
    status: "completed",
    paymentMethod: "cash",
    items: [
      {
        menuItem: {
          id: 4,
          menuCategoryId: 2,
          name: "Chicken Enchiladas",
          description: "Three chicken enchiladas topped with our signature red sauce and cheese",
          price: 15.99,
          imageUrl: "/images/chicken-enchiladas.jpg",
          visible: true,
          sortOrder: 1,
        },
        quantity: 1
      },
      {
        menuItem: {
          id: 1,
          menuCategoryId: 1,
          name: "Nachos Supreme",
          description: "Fresh tortilla chips topped with cheese, jalapeños, tomatoes, and sour cream",
          price: 12.99,
          imageUrl: "/images/nachos-supreme.jpg",
          visible: true,
          sortOrder: 1,
        },
        quantity: 1
      },
      {
        menuItem: {
          id: 10,
          menuCategoryId: 4,
          name: "Horchata",
          description: "Traditional Mexican rice drink with cinnamon",
          price: 3.99,
          imageUrl: "/images/horchata.jpg",
          visible: true,
          sortOrder: 1,
        },
        quantity: 1
      }
    ],
    createdAt: new Date('2024-06-14T18:30:00'),
    updatedAt: new Date('2024-06-14T19:15:00'),
  },
  {
    id: 1002,
    customerName: "John Doe",
    customerPhone: "(555) 123-4567",
    customerEmail: "john@example.com",
    orderType: "to-go",
    total: 21.98,
    status: "completed",
    paymentMethod: "cash",
    items: [
      {
        menuItem: {
          id: 5,
          menuCategoryId: 2,
          name: "Beef Fajitas",
          description: "Sizzling beef fajitas with grilled onions and peppers, served with tortillas and sides",
          price: 18.99,
          imageUrl: "/images/beef-fajitas.jpg",
          visible: true,
          sortOrder: 2,
        },
        quantity: 1
      },
      {
        menuItem: {
          id: 9,
          menuCategoryId: 3,
          name: "Churros",
          description: "Fresh fried churros dusted with cinnamon sugar, served with caramel sauce",
          price: 5.99,
          imageUrl: "/images/churros.jpg",
          visible: true,
          sortOrder: 2,
        },
        quantity: 1
      }
    ],
    createdAt: new Date('2024-06-12T12:45:00'),
    updatedAt: new Date('2024-06-12T13:30:00'),
  },
  {
    id: 1003,
    customerName: "John Doe",
    customerPhone: "(555) 123-4567",
    customerEmail: "john@example.com",
    orderType: "delivery",
    deliveryAddress: "123 Main St, Anytown, ST 12345",
    total: 8.98,
    status: "completed",
    paymentMethod: "cash",
    items: [
      {
        menuItem: {
          id: 3,
          menuCategoryId: 1,
          name: "Jalapeño Poppers",
          description: "Fresh jalapeños stuffed with cream cheese and wrapped in bacon",
          price: 10.99,
          imageUrl: "/images/jalapeno-poppers.jpg",
          visible: true,
          sortOrder: 3,
        },
        quantity: 1
      }
    ],
    createdAt: new Date('2024-06-10T16:20:00'),
    updatedAt: new Date('2024-06-10T17:05:00'),
  }
];

// Mock user profile data
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  createdAt: Date;
}

const mockUserProfile: UserProfile = {
  id: 1,
  name: "John Doe",
  email: "john@example.com", 
  phone: "(555) 123-4567",
  address: "123 Main St, Anytown, ST 12345",
  createdAt: new Date('2024-05-01T10:00:00')
};

// Service functions
export const getUserOrderHistory = async (): Promise<OrderHistory[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockOrderHistory].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getOrderById = async (orderId: number): Promise<OrderHistory | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockOrderHistory.find(order => order.id === orderId) || null;
};

export const getUserProfile = async (): Promise<UserProfile> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return { ...mockUserProfile };
};

export const updateUserProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // In a real app, this would make an API call
  const updatedProfile = { ...mockUserProfile, ...updates };
  console.log('Updating user profile:', updatedProfile);
  return updatedProfile;
};

export const reorderFromHistory = async (orderId: number): Promise<OrderItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const order = mockOrderHistory.find(order => order.id === orderId);
  if (!order) {
    throw new Error('Order not found');
  }
  return [...order.items];
};