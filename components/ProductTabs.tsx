// *********************
// Role of the component: Single product tabs on the single product page containing product description, main product info and reviews
// Name of the component: ProductTabs.tsx
// Developer: Rahim Basheer
// Version: 1.0
// Component call: <ProductTabs product={product} />
// Input parameters: { product: Product }
// Output: Single product tabs containing product description, main product info and reviews
// *********************

"use client";

import React, { useState } from "react";
import RatingPercentElement from "./RatingPercentElement";
import SingleReview from "./SingleReview";
import { formatCategoryName } from "@/utils/categoryFormating";

const ProductTabs = ({ product }: { product: Product }) => {
  const [currentProductTab, setCurrentProductTab] = useState<number>(0);

  return (
  <div className="px-5 text-black">
      {/* Tab buttons */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setCurrentProductTab(0)}
          className={`px-5 py-3 text-lg max-sm:text-base border-t border-l border-r rounded-t-md transition-all ${
            currentProductTab === 0
              ? "bg-white text-black font-semibold shadow-md border-gray-300"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setCurrentProductTab(1)}
          className={`ml-2 px-5 py-3 text-lg max-sm:text-base border-t border-l border-r rounded-t-md transition-all ${
            currentProductTab === 1
              ? "bg-white text-black font-semibold shadow-md border-gray-300"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Additional info
        </button>
      </div>

      {/* Content box */}
      <div className="border border-gray-200 rounded-b-md rounded-tr-md shadow-sm p-5">
        {currentProductTab === 0 && (
          <p className="text-base sm:text-lg leading-relaxed">
            {product?.description || "No description available"}
          </p>
        )}

        {currentProductTab === 1 && (
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left text-base sm:text-lg border border-gray-200">
              <tbody>
                <tr className="border-b">
                  <th className="p-3 w-40 font-medium text-gray-600">Manufacturer</th>
                  <td className="p-3">{product?.manufacturer || "—"}</td>
                </tr>
                <tr className="border-b">
                  <th className="p-3 font-medium text-gray-600">Category</th>
                  <td className="p-3">
                    {product?.category?.name
                      ? formatCategoryName(product.category.name)
                      : "No category"}
                  </td>
                </tr>
                {/* <tr>
                  <th className="p-3 font-medium text-gray-600">Color</th>
                  <td className="p-3">Silver, LightSlateGray, Blue</td>
                </tr> */}
              </tbody>
            </table>
          </div>
        )}
      </div>
  </div>
  );
};

export default ProductTabs;
