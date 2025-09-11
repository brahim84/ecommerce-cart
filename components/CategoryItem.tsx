// *********************
// Role of the component: Category Item that will display category icon, category name and link to the category
// Name of the component: CategoryItem.tsx
// Developer: Rahim Basheer
// Version: 1.0
// Component call: <CategoryItem title={title} href={href} ><Image /></CategoryItem>
// Input parameters: CategoryItemProps interface
// Output: Category icon, category name and link to the category
// *********************

import Link from "next/link";
import React, { type ReactNode } from "react";
import Image from "next/image";
import {
  formatCategoryName,
} from "@/utils/categoryFormating";

interface Category {
  id: string;
  name: string;
}
type CategoryCardProps = {
  item: Category;
};
const CategoryItem: React.FC<CategoryCardProps> = ({ item }) => {
    const iconSrcMap: { [key: string]: string } = {
    "GARAGE-REMOTE": "/garage-image.jpg",
    "CAR-REMOTE": "/sedan-image.jpg",
    "GATE-REMOTE": "/home.png"
  };
  return (
    <div className="flex flex-col items-center gap-y-2 bg-white rounded-2xl shadow-xl p-4 h-fit hover:shadow-2xl transition-shadow duration-300 max-w-xs">
    <Link
      href={`/shop/${item.name}`}
      className="flex flex-col items-center bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition-shadow duration-300 w-full max-w-xs"
    >
      <div className="relative h-44 w-full flex justify-center items-center">
      <Image
        src={`${process.env.NEXT_PUBLIC_API_URL}${iconSrcMap[item.name] || "/product_placeholder.jpg"}`}
        fill
        alt={item.name}
        className="object-contain mb-4 rounded-lg"
      />
      </div>
      <div className="flex items-center justify-between w-full">
        <h3 className="font-semibold text-2xl text-black">{formatCategoryName(item.name)}</h3>
        <button
          aria-label={`View products in ${item.name}`}
          className="text-blue-600 hover:text-blue-800 focus:outline-none"
        >
          {/* Example arrow icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </Link>
    </div>
  );
};




export default CategoryItem;
