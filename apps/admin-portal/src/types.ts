export interface BusinessInfo {
  id?: number
  name: string
  address: string
  phone: string
  hours: string
  logoUrl?: string
}

export interface MenuCategory {
  id?: number
  name: string
  sortOrder: number
}

export interface MenuItem {
  id?: number
  menuCategoryId: number
  name: string
  description?: string
  price: number
  imageUrl?: string
  visible: boolean
  sortOrder: number
  menuCategory?: MenuCategory
}