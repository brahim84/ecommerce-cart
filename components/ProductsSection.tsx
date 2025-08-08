// *********************
// Role of the component: products section intended to be on the home page
// Name of the component: ProductsSection.tsx
// Developer: Rahim Basheer
// Version: 1.0
// Component call: <ProductsSection slug={slug} />
// Input parameters: no input parameters
// Output: products grid
// *********************

import React from "react";
import ProductItem from "./ProductItem";
import Heading from "./Heading";
const API_URL = process.env.NEXT_PUBLIC_API_URL
console.log("API_URL:", process.env.NEXT_PUBLIC_API_URL)
const ProductsSection = async () => {
  // sending API request for getting all products

  // const data = await fetch(`${API_URL}/api/products`);
  // const products = await data.json();

  const raw = await fetch(`${API_URL}/api/products`, { cache: "no-store" }).then(r => r.json())
  //console.log("---raw---",raw)

  const products = Array.isArray(raw) ? raw : []

  //console.log("---products---",products)
  return (
    <div className="bg-blue-500 border-t-4 border-white">
      <Heading title="FEATURED PRODUCTS" />
      <div className="max-w-screen-2xl mx-auto py-10 px-16 max-md:px-10 flex flex-wrap gap-x-5 gap-y-5 justify-center">
        {products.map((product: Product) => (
          <ProductItem key={product.id} product={product} color="white" />
        ))}
      </div>
    </div>
  );
};

export default ProductsSection;
