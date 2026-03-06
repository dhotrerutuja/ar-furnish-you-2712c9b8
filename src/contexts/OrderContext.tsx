import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem } from "./CartContext";
import { products } from "@/data/products";

export type OrderStatus = "placed" | "confirmed" | "shipped" | "out-for-delivery" | "delivered";

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  shippingAddress: string;
  customer: OrderCustomer;
  createdAt: Date;
  estimatedDelivery: Date;
  timeline: { status: OrderStatus; date: Date; completed: boolean }[];
}

interface OrderContextType {
  orders: Order[];
  placeOrder: (items: CartItem[], totalAmount: number, paymentMethod: string, shippingAddress: string, customer: OrderCustomer) => string;
  getOrder: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDER_KEY = "vh_orders";

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

const loadOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(ORDER_KEY);
    if (!raw) return [];
    const saved = JSON.parse(raw);
    return saved.map((o: any) => ({
      ...o,
      customer: o.customer || { name: "N/A", email: "N/A", phone: "N/A" },
      createdAt: new Date(o.createdAt),
      estimatedDelivery: new Date(o.estimatedDelivery),
      timeline: o.timeline.map((t: any) => ({ ...t, date: new Date(t.date) })),
      items: o.items.map((item: any) => {
        const product = products.find((p) => p.id === item.productId);
        return product ? { product, quantity: item.quantity } : null;
      }).filter(Boolean),
    }));
  } catch {
    return [];
  }
};

const saveOrders = (orders: Order[]) => {
  const serializable = orders.map((o) => ({
    ...o,
    items: o.items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
  }));
  localStorage.setItem(ORDER_KEY, JSON.stringify(serializable));
};

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(loadOrders);

  useEffect(() => { saveOrders(orders); }, [orders]);

  const placeOrder = (items: CartItem[], totalAmount: number, paymentMethod: string, shippingAddress: string, customer: OrderCustomer) => {
    const id = "VH-" + Date.now().toString(36).toUpperCase();
    const createdAt = new Date();
    const estimatedDelivery = new Date(createdAt.getTime() + 96 * 3600000);
    const order: Order = {
      id, items, totalAmount, status: "confirmed", paymentMethod, shippingAddress, customer, createdAt, estimatedDelivery,
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
