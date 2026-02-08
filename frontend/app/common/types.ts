
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
};

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    salePrice: number;
    image: string;
    category: string;
    isFeatured: boolean;
    quantity: number;
    closeOut: boolean;
    createdAt?: string;
    updatedAt?: string;
    tags?: string[];
    brand?: string;
    rating?: number;
    reviews?: number;
    slug?: string;
}