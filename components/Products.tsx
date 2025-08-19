"use client";
import React, { useEffect, useState } from "react";
import ProductItem from "./ProductItem";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ProductsProps {
  slug: any;
}

export default function Products({ slug }: ProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Stable params
  const price = slug?.searchParams?.price ?? 3000;
  const rating = slug?.searchParams?.rating ?? 0;
  const inStock = String(slug?.searchParams?.inStock ?? "false");
  const outOfStock = String(slug?.searchParams?.outOfStock ?? "false");
  const sort = slug?.searchParams?.sort ?? "";
  const page = slug?.searchParams?.page ?? 1;
  const categorySlug = slug?.params?.slug?.length > 0 ? slug.params.slug : "";

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function loadProducts() {
      setLoading(true);

      const inStockBool = inStock === "true";
      const outOfStockBool = outOfStock === "true";

      let stockMode: "lte" | "equals" | "lt" = "lte";
      if (inStockBool && outOfStockBool) stockMode = "lte";         // both
      else if (inStockBool && !outOfStockBool) stockMode = "equals"; // only in-stock
      else if (!inStockBool && outOfStockBool) stockMode = "lt";     // only out-of-stock
      else stockMode = "lte";                                        // none selected → all

      const categoryFilter = categorySlug
        ? `filters[category][$equals]=${encodeURIComponent(categorySlug)}&`
        : "";

      try {
        const res = await fetch(
          `${API_URL}/api/products?filters[price][$lte]=${price}` +
            `&filters[rating][$gte]=${rating}` +
            `&filters[inStock][$${stockMode}]=1&${categoryFilter}` +
            `sort=${encodeURIComponent(sort)}&page=${page}`,
          { signal }
        );

        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json = await res.json();
        if (!signal.aborted) setProducts(Array.isArray(json) ? json : []);
      } catch (err) {
        if (!signal.aborted) {
          console.error("Failed to fetch products:", err);
          setProducts([]);
        }
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    }

    loadProducts();
    return () => controller.abort();
  }, [price, rating, inStock, outOfStock, sort, page, categorySlug]);

  if (!loading && products.length === 0) {
    return (
      <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
        No products found for specified query
      </h3>
    );
  }

  return (
    <div className="grid grid-cols-3 w-max mx-auto gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
      {products.map((product: Product) => (
        <ProductItem key={product.id} product={product} color="black" />
      ))}
    </div>
  );
}
