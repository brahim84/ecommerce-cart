"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSortStore } from "@/app/_zustand/sortStore";
import { usePaginationStore } from "@/app/_zustand/paginationStore";

interface InputCategory {
  inStock: { text: string; isChecked: boolean };
  outOfStock: { text: string; isChecked: boolean };
  priceFilter: { text: string; value: number };
  ratingFilter: { text: string; value: number };
}

const Filters = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams(); // current URL params
  const { replace } = useRouter();

  const { page } = usePaginationStore();
  const { setPage } = usePaginationStore();
  const { sortBy } = useSortStore();

  const [inputCategory, setInputCategory] = useState<InputCategory>({
    inStock: { text: "instock", isChecked: true },
    outOfStock: { text: "outofstock", isChecked: true },
    priceFilter: { text: "price", value: 3000 },
    ratingFilter: { text: "rating", value: 0 },
  });

  useEffect(() => {
    // If there are no search params at all, reset pagination to page 1 to avoid persisting previous state
    if (!searchParams || searchParams.toString().trim() === "") {
      setPage(1);
    }

    // Start from current params to avoid unnecessary changes
    const params = new URLSearchParams(searchParams.toString());

    params.set("outOfStock", String(inputCategory.outOfStock.isChecked));
    params.set("inStock", String(inputCategory.inStock.isChecked));
    params.set("rating", String(inputCategory.ratingFilter.value));
    params.set("price", String(inputCategory.priceFilter.value));
    params.set("sort", sortBy);
    params.set("page", String(page));

    const next = `${pathname}?${params.toString()}`;
    const current = `${pathname}?${searchParams.toString()}`;

    if (next !== current) {
      replace(next); // triggers one update only when something actually changed
    }
  }, [inputCategory, sortBy, page, pathname, searchParams, replace]);

  return (
    <div>
      <h3 className="text-2xl mb-2">Filters</h3>
      <div className="divider"></div>
      <div className="flex flex-col gap-y-1">
        <h3 className="text-md mb-2">Availability</h3>
        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.inStock.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  inStock: {
                    text: "instock",
                    isChecked: !inputCategory.inStock.isChecked,
                  },
                })
              }
              className="checkbox"
            />
            <span className="label-text text-md ml-2 text-black">In stock</span>
          </label>
        </div>

        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.outOfStock.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  outOfStock: {
                    text: "outofstock",
                    isChecked: !inputCategory.outOfStock.isChecked,
                  },
                })
              }
              className="checkbox"
            />
            <span className="label-text text-md ml-2 text-black">
              Out of stock
            </span>
          </label>
        </div>
      </div>

      <div className="divider"></div>
      <div className="flex flex-col gap-y-1">
        <h3 className="text-md mb-2">Price</h3>
        <div>
          <input
            type="range"
            min={0}
            max={3000}
            step={10}
            value={inputCategory.priceFilter.value}
            className="range"
            onChange={(e) =>
              setInputCategory({
                ...inputCategory,
                priceFilter: {
                  text: "price",
                  value: Number(e.target.value),
                },
              })
            }
          />
          <span>{`Max price: $${inputCategory.priceFilter.value}`}</span>
        </div>
      </div>

      <div className="divider"></div>

      <div>
        <h3 className="text-md mb-2">Minimum Rating:</h3>
        <input
          type="range"
          min={0}
          max="5"
          value={inputCategory.ratingFilter.value}
          onChange={(e) =>
            setInputCategory({
              ...inputCategory,
              ratingFilter: { text: "rating", value: Number(e.target.value) },
            })
          }
          className="range range-info"
          step="1"
        />
        <div className="w-full flex justify-between text-xs px-2">
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>
    </div>
  );
};

export default Filters;
