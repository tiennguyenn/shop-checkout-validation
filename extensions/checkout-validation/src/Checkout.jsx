import {
  reactExtension,
  useBillingAddress,
  useBuyerJourneyIntercept,
  useCartLines,
  useEmail,
  useShippingAddress,
  useTotalAmount,
} from "@shopify/ui-extensions-react/checkout";

import AgeChecker from "./AgeChecker.js";

// 1. Choose an extension target
export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const url = "https://staging.getwaave.co/compliance/validate";

  const billing = useBillingAddress();
  const shipping = useShippingAddress();

  const email = useEmail();
  const amount = useTotalAmount();

  const items = useCartLines();
  const products = items.map((item) => {
    return {
      id: item.merchandise.id,
      name: item.merchandise.title,
      sku: item.merchandise.sku,
      price: item.cost.totalAmount,
      quantity: item.quantity,
      categories: [],
    };
  });

  const data = {
    venue_id: 1,
    amount: amount,
    email: email,
    ip_address: "0.0.0.0",
    products: products,
    billing: {
      billing_first_name: billing.firstName,
      billing_last_name: billing.lastName,
      billing_country: billing.countryCode,
      billing_address_1: billing.address1,
      billing_address_2: billing.address2,
      billing_city: billing.city,
      billing_state: billing.provinceCode,
      billing_postcode: billing.provinceCode,
      billing_phone: billing.phone,
      billing_email: email,
    },
    shipping: {
      shipping_first_name: shipping.firstName,
      shipping_last_name: shipping.lastName,
      shipping_country: shipping.countryCode,
      shipping_address_1: shipping.address1,
      shipping_address_2: shipping.address2,
      shipping_city: shipping.city,
      shipping_state: "",
      shipping_postcode: shipping.provinceCode,
      shipping_phone: shipping.phone,
      shipping_email: email,
    },
    is_need_to_check: true,
    compliance_standalone: "1",
  };

  const validate = async () => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        return {
          behavior: "allow",
        };
      }

      // AgeChecker.showPopup();

      return {
        behavior: "block",
        reason: "reason",
        errors: [{ message: result.message }],
      };
    } catch (error) {
      return {
        behavior: "block",
        reason: "reason",
        errors: [{ message: error }],
      };
    }
  };

  useBuyerJourneyIntercept(async () => {
    return await validate();
  });

  return <></>;
}
