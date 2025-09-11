// *********************
// Role of the component: Category wrapper that will contain title and category items
// Name of the component: CategoryMenu.tsx
// Developer: Rahim Basheer
// Version: 1.0
// Component call: <CategoryMenu />
// Input parameters: no input parameters
// Output: section title and category items
// *********************
"use client";
import React, { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";

import Heading from "./Heading";

const CategoryMenu = () => {

  const [categoryMenuList, setCategories] =   useState<Category[]>([]);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategories(data);
      });
  }, []);

  return (
    <div className="py-10 bg-blue-500">
      <Heading title="BROWSE CATEGORIES" />
      {/* <div className="max-w-screen-2xl mx-auto py-10 px-16 max-md:px-10 flex flex-wrap gap-x-5 gap-y-5 justify-center">
        {categoryMenuList.map((item) => (
          <div key={item.id} className="flex flex-col items-center justify-center bg-white rounded-xl shadow-lg">
            <CategoryItem title={formatCategoryName(item.name)} href={`/shop/${item.id}`}>
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${iconSrcMap[item.name] || "/product_placeholder.jpg"}`}
                width={48}
                height={48}
                alt={item.name}
              />
            </CategoryItem>
          </div>
        ))}
      </div> */}

    <div className="max-w-screen-2xl mx-auto py-10 px-16 max-md:px-10 flex flex-wrap gap-x-10 gap-y-5 justify-center">
      {categoryMenuList.map((item) => (
        <CategoryItem key={item.id} item={item} />
      ))}
    </div>


    </div>
  );
};

export default CategoryMenu;
