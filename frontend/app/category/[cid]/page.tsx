'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Product } from '@/common/types';
import ProductCard from '@/components/common/product/ProductCard';
import { useNavigation } from '@/components/hooks/useNavigation';
import { toast } from 'sonner';

export default function ProductsPage() {
  const { cid } = useParams();
  console.log("Category ID:", cid);

  const {navigate} = useNavigation();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cid) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/category/${cid}`
        );

        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await res.json();
        setProducts(data?.products);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [cid]);

  const addToCart = async (product: Product) => {
    // add product to cart logic here
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add product to cart');
      }

      toast.success("product added to cart successfully.");
    } catch (err: any) {
      console.error('Error adding product to cart:', err.message);
      toast.error("failed to add product to cart, ", err.message);
    }
  }

  if (!cid) {
    return <div className="p-4">No category selected.</div>;
  }

  if (loading) {
    return <div className="p-4">Loading products...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Products in Category {cid}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCart} navigate={navigate}  />
        ))}
      </div>
    </div>
  );
}
