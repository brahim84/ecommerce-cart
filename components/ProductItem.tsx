// *********************
// Role of the component: Product item component 
// Name of the component: ProductItem.tsx
// Developer: Rahim Basheer
// Version: 1.0
// Component call: <ProductItem product={product} color={color} />
// Input parameters: { product: Product; color: string; }
// Output: Product item component that contains product image, title, link to the single product page, price, button...
// *********************
"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import ProductItemRating from "./ProductItemRating";

const ProductItem = ({
  product,
  color,
}: {
  product: Product;
  color: string;
}) => {
  return (
    <div className="flex flex-col items-center gap-y-2 bg-white rounded-2xl shadow-xl p-4 hover:shadow-2xl transition-shadow duration-300 max-w-xs">
      <Link href={`/product/${product.slug}`}>
        <Image
          src={
            product.mainImage
              ? `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_UPLOADS_URL}/${product.mainImage}`
              : "/product_placeholder.jpg"
          }
          width="0"
          height="0"
          sizes="75vw"
          className="w-auto h-[200px] rounded-xl shadow-lg transition-transform duration-300 ease-in-out hover:scale-110"
          alt={product?.title}
        />
      </Link>
      <Link
        href={`/product/${product.slug}`}
        className={`text-xl font-normal mt-2 uppercase w-full break-words text-center`}
      >
        {product.title}
      </Link>
      <p
        className={
          color === "black"
            ? "text-lg text-black font-bold bg-gray-100 px-3 py-1 rounded-full mt-2"
            : "text-lg text-white font-bold bg-blue-600 px-3 py-1 rounded-full mt-2"
        }
      >
        ${product.price}
      </p>
      <ProductItemRating productRating={product?.rating} />
      <Link
        href={`/product/${product?.slug}`}
        className="block w-full text-center uppercase bg-blue-600 px-0 py-2 text-base rounded-lg font-bold text-white shadow hover:bg-blue-700 transition-colors duration-200 mt-3"
      >
        <p>View product</p>
      </Link>
    </div>
  );
};

export default ProductItem;
