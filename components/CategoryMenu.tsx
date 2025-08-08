// *********************
// Role of the component: Category wrapper that will contain title and category items
// Name of the component: CategoryMenu.tsx
// Developer: Rahim Basheer
// Version: 1.0
// Component call: <CategoryMenu />
// Input parameters: no input parameters
// Output: section title and category items
// *********************

import React from "react";
import CategoryItem from "./CategoryItem";
import Image from "next/image";
import { categoryMenuList } from "@/lib/utils";
import Heading from "./Heading";
import { env } from "process";

//console.log("---cat---",categoryMenuList)

const CategoryMenu = () => {
  return (
    <div className="py-10 bg-blue-500">
      <Heading title="BROWSE CATEGORIES" />
      <div className="max-w-screen-2xl mx-auto py-10 px-16 max-md:px-10 flex flex-wrap gap-x-5 gap-y-5 justify-center">
        {categoryMenuList.map((item) => (
          <div key={item.id} className="flex flex-col items-center justify-center bg-white rounded-xl shadow-lg">
            <CategoryItem title={item.title} href={item.href}>
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/${item.src}`}
                width={48}
                height={48}
                alt={item.title}
              />
            </CategoryItem>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
