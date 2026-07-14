import React, { useRef, useEffect, useMemo } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = ({ amount, onSuccess, onError }) => {
  const amountRef = useRef(amount);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  // Keep latest values without remounting PayPalButtons
  useEffect(() => {
    amountRef.current = amount;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [amount, onSuccess, onError]);

  // Stable createOrder
  const createOrder = useMemo(
    () => async (data, actions) => {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: amountRef.current.toString(),
            },
          },
        ],
      });
    },
    []
  );

  // Stable onApprove
  const onApprove = useMemo(
    () => async (data, actions) => {
      const details = await actions.order.capture();
      if (onSuccessRef.current) {
        onSuccessRef.current(details);
      }
    },
    []
  );

  // Stable onError
  const onErrorHandler = useMemo(
    () => (err) => {
      console.error("PayPal Error:", err);
      if (onErrorRef.current) {
        onErrorRef.current(err);
      }
    },
    []
  );

  return (
    <PayPalButtons
      style={{ layout: "vertical" }}
      createOrder={createOrder}
      onApprove={onApprove}
      onError={onErrorHandler}
      forceReRender={[amount]}
    />
  );
};

export default PayPalButton;
