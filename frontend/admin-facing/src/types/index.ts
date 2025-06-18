export interface User {
  id: number;
  email: string;
  username: string;
  createdAt?: string;
}

export interface Post {
  id: number;
  title: string;
  content?: string;
  published: boolean;
  authorId: number;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface CreatePostData {
  title: string;
  content?: string;
  published?: boolean;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  published?: boolean;
}

// Menu and Business types for Admin Portal
export interface MenuCategory {
  id: number;
  name: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  items?: MenuItem[];
}

export interface MenuItem {
  id: number;
  menuCategoryId: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  visible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  categoryName?: string;
}

export interface BusinessInfo {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  hours?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuCategoryData {
  name: string;
  sortOrder?: number;
}

export interface UpdateMenuCategoryData {
  name?: string;
  sortOrder?: number;
}

export interface CreateMenuItemData {
  menuCategoryId: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  visible?: boolean;
  sortOrder?: number;
}

export interface UpdateMenuItemData {
  menuCategoryId?: number;
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  visible?: boolean;
  sortOrder?: number;
}

export interface UpdateBusinessInfoData {
  name: string;
  address?: string;
  phone?: string;
  hours?: string;
  logoUrl?: string;
}