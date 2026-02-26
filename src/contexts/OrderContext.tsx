import React, { createContext, useContext, useState, ReactNode } from "react";
import { CartItem } from "./CartContext";

export type OrderStatus = "placed" | "confirmed" | "shipped" | "out-for-delivery" | "delivered";

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  shippingAddress: string;
  createdAt: Date;
  estimatedDelivery: Date;
  timeline: { status: OrderStatus; date: Date; completed: boolean }[];
}

interface OrderContextType {
  orders: Order[];
  placeOrder: (items: CartItem[], totalAmount: number, paymentMethod: string, shippingAddress: string) => string;
  getOrder: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const generateTimeline = (createdAt: Date): Order["timeline"] => {
  const d = new Date(createdAt);
  return [
    { status: "placed", date: d, completed: true },
    { status: "confirmed", date: new Date(d.getTime() + 2 * 3600000), completed: true },
    { status: "shipped", date: new Date(d.getTime() + 24 * 3600000), completed: true },
    { status: "out-for-delivery", date: new Date(d.getTime() + 72 * 3600000), completed: false },
    { status: "delivered", date: new Date(d.getTime() + 96 * 3600000), completed: false },
  ];
};

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const placeOrder = (items: CartItem[], totalAmount: number, paymentMethod: string, shippingAddress: string) => {
    const id = "VH-" + Date.now().toString(36).toUpperCase();
    const createdAt = new Date();
    const estimatedDelivery = new Date(createdAt.getTime() + 96 * 3600000);
    const order: Order = {
      id, items, totalAmount, status: "confirmed", paymentMethod, shippingAddress, createdAt, estimatedDelivery,
      timeline: generateTimeline(createdAt),
    };
    setOrders((prev) => [order, ...prev]);
    return id;
  };

  const getOrder = (orderId: string) => orders.find((o) => o.id === orderId);

  return (
    <OrderContext.Provider value={{ orders, placeOrder, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within OrderProvider");
  return context;
};
