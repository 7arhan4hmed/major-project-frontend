export type OrderStatus = 'PLACED' | 'PROCESSING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'SUCCESSFUL' | 'PENDING' | 'FAILED';
export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
export type ServiceHealthStatus = 'HEALTHY' | 'DEGRADED' | 'DOWN';
export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export interface OrderItem {
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderTimelineStep {
  title: string;
  service: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'FAILED';
  timestamp: string;
  description: string;
  eventId?: string;
}

export interface Order {
  id: string; // e.g. ORD-2026-9041
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'Credit Card' | 'UPI / NetBanking' | 'Corporate PO' | 'Digital Wallet';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
  correlationId: string;
  timeline: OrderTimelineStep[];
}

export interface Product {
  id: string; // e.g. PROD-101
  sku: string;
  name: string;
  category: string;
  price: number;
  availableStock: number;
  reservedStock: number;
  minThreshold: number;
  status: StockStatus;
  lastUpdated: string;
  description?: string;
}

export interface Payment {
  id: string; // e.g. PAY-40892
  orderId: string;
  customerName: string;
  amount: number;
  paymentMethod: string;
  status: PaymentStatus;
  transactionRef: string;
  failureReason?: string;
  timestamp: string;
  retryCount: number;
  correlationId: string;
}

export type KafkaTopic = 
  | 'order.events'
  | 'inventory.events'
  | 'payment.events'
  | 'notification.events'
  | 'system.events';

export type KafkaEventName =
  | 'OrderPlaced'
  | 'InventoryReserved'
  | 'InventoryUpdated'
  | 'InventoryReservationFailed'
  | 'PaymentInitiated'
  | 'PaymentCompleted'
  | 'PaymentFailed'
  | 'OrderConfirmed'
  | 'OrderCancelled'
  | 'NotificationSent'
  | 'ServiceUnavailable'
  | 'ServiceRestored';

export interface KafkaEvent {
  eventId: string; // e.g. evt-7a4c9b2e
  eventName: KafkaEventName;
  topic: KafkaTopic;
  producerService: string;
  consumerService: string;
  partition: number;
  offset: number;
  status: 'PROCESSED' | 'PUBLISHED' | 'FAILED';
  timestamp: string;
  correlationId: string;
  payload: Record<string, any>;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'ORDER' | 'PAYMENT' | 'INVENTORY' | 'SYSTEM' | 'ALERT';
  read: boolean;
  timestamp: string;
  relatedEntityId?: string;
}

export interface Microservice {
  id: string;
  name: string;
  port: number;
  version: string;
  status: ServiceHealthStatus;
  responseTimeMs: number;
  requestCount: number;
  errorRatePercent: number;
  uptimePercent: number;
  lastHealthCheck: string;
  description: string;
  dependencies: string[];
  type: 'SERVICE' | 'BROKER' | 'DATABASE';
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  serviceName: string;
  message: string;
  correlationId: string;
  metadata?: Record<string, any>;
}

export type NavPage = 
  | 'overview'
  | 'orders'
  | 'products'
  | 'payments'
  | 'notifications'
  | 'kafka'
  | 'microservices'
  | 'logs'
  | 'architecture';
