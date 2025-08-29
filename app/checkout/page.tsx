"use client";
import { SectionTitle } from "@/components";
import { useProductStore } from "../_zustand/store";
import Image from "next/image";
import { useEffect, useMemo, useState, useRef } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { isValidEmailAddressFormat, isValidNameOrLastname } from "@/lib/utils";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { useSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


type UserProfile = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
};

type UserAddress = {
  id: string;
  label?: string | null;
  name?: string | null;
  phone?: string | null;
  line1: string;
  line2?: string | null;
  city: string;
  region?: string | null;       
  postalCode: string;
  country: string;
  isDefaultShipping?: boolean;
};


const CheckoutPage = () => {
  const authFetch = useAuthFetch();
  const { status } = useSession();
  const saveTimer = useRef<NodeJS.Timeout | null>(null);
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    lastname: "",
    phone: "",
    email: "",
    line1: "",
    line2: "",
    city: "",
    country: "",
    postalCode: "",
    orderNotice: "",
  });

  const { products, total, calculateTotals } = useProductStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [saveAddress, setSaveAddress] = useState<boolean>(true); // checkbox to save edited/new address

  // Choose default address (memoized)
  const defaultAddress = useMemo(() => {
    if (!addresses.length) return null;
    const def = addresses.find(a => a.isDefaultShipping);
    return def ?? addresses[0];
  }, [addresses]);

  // ---- Load profile + addresses for logged-in users
  useEffect(() => {
    calculateTotals();
    if (products.length === 0) {
      toast.error("You don't have items in your cart");
      router.push("/cart");
    }

    (async () => {
      console.log("Fetching profile and addresses...");
      try {
        // profile
        const pRes = await authFetch(`${API_URL}/api/user-profile`);
        if (pRes.ok) {
          const p: UserProfile = await pRes.json();
          setProfile(p);
        }

        // addresses
        const aRes = await authFetch(`${API_URL}/api/user-address`);
        if (aRes.ok) {
          const arr: UserAddress[] = await aRes.json();
          setAddresses(arr);
          // preselect default
          const def = arr.find(a => a.isDefaultShipping) ?? arr[0];
          if (def) setSelectedAddressId(def.id);
        }
      } catch (err: any) {
        console.error("Fetching profile error:", err);
        return new Response(err.message ?? "Something went wrong", { status: 500 });
      }
    })();
  }, []);

// Autosave contact on change only when authenticated
useEffect(() => {
  if (status !== "authenticated") return;

  if (saveTimer.current) clearTimeout(saveTimer.current);
  saveTimer.current = setTimeout(async () => {
    const f = checkoutForm;
    if (!f.name && !f.lastname && !f.phone) return;

    try {
      await authFetch(`${API_URL}/api/user-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: f.name,
          lastName:  f.lastname,
          phone:     f.phone,
        }),
      });
    } catch (e) {
      // ignore; non-blocking
    }
  }, 600); // 600ms debounce
  return () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
  };
  // re-run when these fields change
}, [checkoutForm.name, checkoutForm.lastname, checkoutForm.phone, status, authFetch]);



  useEffect(() => {
    setCheckoutForm(prev => {
      const next = { ...prev };

      if (profile) {
        if (!next.name && profile.firstName) next.name = profile.firstName;
        if (!next.lastname && profile.lastName) next.lastname = profile.lastName;
        if (!next.phone && profile.phone) next.phone = profile.phone;
        if (!next.email && profile.email) next.email = profile.email;
      }

      const chosen = addresses.find(a => a.id === selectedAddressId) ?? defaultAddress;
      if (chosen) {
        if (!next.line1) next.line1 = chosen.line1 ?? "";
        if (!next.line2 && chosen.line2) next.line2 = chosen.line2;
        if (!next.city) next.city = chosen.city ?? "";
        if (!next.country) next.country = chosen.country ?? "";
        if (!next.postalCode) next.postalCode = chosen.postalCode ?? "";
      }

      return next;
    });
  }, [profile, addresses, selectedAddressId, defaultAddress]);

  const makePurchase = async () => {
    const f = checkoutForm;
    if (
      !f.name || !f.lastname || !f.phone || !f.email ||
      !f.line1 || !f.city || !f.country || !f.postalCode
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!isValidNameOrLastname(f.name))    { toast.error("Invalid name"); return; }
    if (!isValidNameOrLastname(f.lastname)){ toast.error("Invalid lastname"); return; }
    if (!isValidEmailAddressFormat(f.email)){ toast.error("Invalid email"); return; }
    if (!products?.length) return;

    setLoading(true);
    let orderId = "";

    // Optionally save address to the user's address book if user is logged in and checked "save"
    try {
      if (saveAddress && status === "authenticated") {
        await authFetch(`${API_URL}/api/user-address`, {
          method: "POST",
          headers: { "Content-Type": "application/json"},
          body: JSON.stringify({
            line1: f.line1,
            line2: f.line2 || null,
            city: f.city,
            region: null, 
            postalCode: f.postalCode,
            country: f.country,
            isDefaultShipping: addresses.length === 0, // first saved becomes default
          }),
        });
      }
    } catch {
      // non-blocking; continue checkout
    }

    // Create order
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
          name: f.name,
          lastname: f.lastname,
          phone: f.phone,
          email: f.email,
          line1: f.line1,
          line2: f.line2,
          postalCode: f.postalCode,
          total: total,
          city: f.city,
          country: f.country,
          orderNotice: f.orderNotice,
        }),
      });
      if (!response.ok) {
        toast.error("Failed to create order");
        setLoading(false);
        return;
      }
      const data = await response.json();
      orderId = data.id;

      //Create order-product rows in parallel
      await Promise.all(
        products.map((p) =>
          fetch(`${API_URL}/api/order-product`, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
              customerOrderId: orderId,
              productId: p.id,
              quantity: p.amount,
            }),
          })
        )
      );
    } catch (error) {
      toast.error("Failed to create order");
      setLoading(false);
      return;
    }

    // Start Stripe Checkout
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: products.map((p) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            image: p.image?.startsWith("http")
              ? p.image
              : p.image
                ? `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_UPLOADS_URL}/${p.image}`
                : undefined,
            amount: p.amount,
          })),
          customer_email: f.email,
          orderId,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to create checkout session");
      }

      const { url } = await res.json();
      setLoading(false);
      window.location.href = url;
    } catch (e: any) {
      toast.error(e.message ?? "Payment init failed");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <SectionTitle title="Checkout" path="Home | Cart | Checkout" />

      <div
        className="hidden h-full w-1/2 bg-white lg:block"
        aria-hidden="true"
      />
      <div
        className="hidden h-full w-1/2 bg-gray-50 lg:block"
        aria-hidden="true"
      />

      <main className="relative mx-auto grid max-w-screen-2xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">
        <h1 className="sr-only">Order information</h1>

        <section
          aria-labelledby="summary-heading"
          className="bg-gray-50 px-4 pb-10 pt-16 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16"
        >
          <div className="mx-auto max-w-lg lg:max-w-none">
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Order summary
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 text-sm font-medium text-gray-900"
            >
              {products.map((product) => (
                <li
                  key={product?.id}
                  className="flex items-start space-x-4 py-6"
                >
                  <Image
                    src={product?.image ? `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_UPLOADS_URL}/${product?.image}` : "/product_placeholder.jpg"}
                    alt={product?.title}
                    width={80}
                    height={80}
                    className="h-20 w-20 flex-none rounded-md object-cover object-center"
                  />
                  <div className="flex-auto space-y-1">
                    <h3>{product?.title}</h3>
                    <p className="text-gray-500">x{product?.amount}</p>
                  </div>
                  <p className="flex-none text-base font-medium">
                    ${product?.price}
                  </p>
                  <p></p>
                </li>
              ))}
            </ul>

            <dl className="hidden space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-900 lg:block">
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd>${total}</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Shipping</dt>
                <dd> 
                  <div className="flex gap-2">
                    <div className="line-through">$5.00</div>
                    <div>$0.00</div>
                  </div>
                </dd>
              </div>

              {/* <div className="flex items-center justify-between">
                <dt className="text-gray-600">Taxes</dt>
                <dd>${total / 5}</dd>
              </div> */}

              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <dt className="text-base">Total</dt>
                <dd className="text-base">
                  ${total === 0 ? 0 : Math.round(total)}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* FORM */}
        <form className="px-4 pt-16 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0">
          <div className="mx-auto max-w-lg lg:max-w-none">
            <section aria-labelledby="contact-info-heading">
              <h2
                id="contact-info-heading"
                className="text-lg font-medium text-gray-900"
              >
                Contact information
              </h2>

              <div className="mt-6">
                <label
                  htmlFor="name-input"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.name}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        name: e.target.value,
                      })
                    }
                    type="text"
                    id="name-input"
                    name="name-input"
                    autoComplete="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="lastname-input"
                  className="block text-sm font-medium text-gray-700"
                >
                  Lastname
                </label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.lastname}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        lastname: e.target.value,
                      })
                    }
                    type="text"
                    id="lastname-input"
                    name="lastname-input"
                    autoComplete="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="phone-input"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone number
                </label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.phone}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        phone: e.target.value,
                      })
                    }
                    type="tel"
                    id="phone-input"
                    name="phone-input"
                    autoComplete="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.email}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        email: e.target.value,
                      })
                    }
                    type="email"
                    id="email-address"
                    name="email-address"
                    autoComplete="email"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </section>

            {/* Saved addresses shows only when addresses exist */}
            {addresses.length > 0 && (
              <section className="mt-10">
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  Use a saved address
                </h3>
                <div className="space-y-2">
                  {addresses.map((a) => (
                    <label key={a.id} className="flex items-start gap-3 rounded-md border p-3 hover:bg-gray-50">
                      <input
                        type="radio"
                        name="saved-address"
                        checked={selectedAddressId === a.id}
                        onChange={() => {
                          setSelectedAddressId(a.id);
                          // Immediately apply the chosen address to the form
                          setCheckoutForm(cf => ({
                            ...cf,
                            line1: a.line1 ?? "",
                            line2: a.line2 ?? "",
                            city: a.city ?? "",
                            country: a.country ?? "",
                            postalCode: a.postalCode ?? "",
                          }));
                        }}
                      />
                      <div className="text-sm">
                        <div className="font-medium">
                          {a.label || "Address"} {a.isDefaultShipping && <span className="ml-2 rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">Default</span>}
                        </div>
                        <div className="text-gray-600">
                          {a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.postalCode}, {a.country}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </section>
            )}

            <section aria-labelledby="shipping-heading" className="mt-10">
              <h2
                id="shipping-heading"
                className="text-lg font-medium text-gray-900"
              >
                Shipping address
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      autoComplete="street-address"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={checkoutForm.line1}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          line1: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="apartment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Apartment, suite, etc.
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="apartment"
                      name="apartment"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={checkoutForm.line2}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          line2: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      autoComplete="address-level2"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={checkoutForm.city}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          city: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="region"
                      name="region"
                      autoComplete="address-level1"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={checkoutForm.country}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          country: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="postal-code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Postal code
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="postal-code"
                      name="postal-code"
                      autoComplete="postal-code"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={checkoutForm.postalCode}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          postalCode: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="order-notice"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Order notice
                  </label>
                  <div className="mt-1">
                    <textarea
                      className="textarea textarea-bordered textarea-lg w-full"
                      id="order-notice"
                      name="order-notice"
                      autoComplete="order-notice"
                      value={checkoutForm.orderNotice}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          orderNotice: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                </div>
              </div>
            </section>
            {/*  Save address toggle - only for logged-in users */}
            {status === "authenticated" && (
              <div className="mt-6 flex items-center gap-2">
                <input
                  id="save-address"
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                />
                <label htmlFor="save-address" className="text-sm text-gray-700">
                  Save this address to my account
                </label>
              </div>
            )}

            <div className="mt-10 border-t border-gray-200 pt-6 ml-0">
              <button
                type="button"
                onClick={makePurchase}
                className="w-full rounded-md border border-transparent bg-blue-500 px-20 py-2 text-lg font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last"
              >
                {loading ? "Redirecting..." : "Pay Now"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CheckoutPage;
