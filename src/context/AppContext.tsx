import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Order,
  Product,
  Payment,
  KafkaEvent,
  NotificationItem,
  Microservice,
  SystemLog,
  NavPage,
  OrderStatus,
  PaymentStatus,
  StockStatus,
  LogLevel
} from '../types';
import {
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_PAYMENTS,
  INITIAL_KAFKA_EVENTS,
  INITIAL_MICROSERVICES,
  INITIAL_NOTIFICATIONS,
  INITIAL_SYSTEM_LOGS
} from '../data/initialData';

interface WorkflowExecutionState {
  isActive: boolean;
  scenario: 'SUCCESS' | 'PAYMENT_FAILURE';
  step: number; // 0 to 5
  status: 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  currentAction: string;
  orderId?: string;
  logs: string[];
}

interface AppContextType {
  orders: Order[];
  products: Product[];
  payments: Payment[];
  kafkaEvents: KafkaEvent[];
  microservices: Microservice[];
  notifications: NotificationItem[];
  logs: SystemLog[];
  currentPage: NavPage;
  setCurrentPage: (page: NavPage) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isPausedFeed: boolean;
  setIsPausedFeed: (paused: boolean | ((prev: boolean) => boolean)) => void;
  workflowState: WorkflowExecutionState;
  
  // Actions
  placeOrder: (orderData: {
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    items: { productId: string; quantity: number }[];
    paymentMethod: 'Credit Card' | 'UPI / NetBanking' | 'Corporate PO' | 'Digital Wallet';
  }) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  
  cancelOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateStock: (productId: string, newAvailable: number) => void;
  adjustStockDelta: (productId: string, delta: number) => void;
  addProduct: (product: Omit<Product, 'id' | 'lastUpdated' | 'status' | 'reservedStock'>) => void;
  retryPayment: (paymentId: string) => Promise<boolean>;
  toggleServiceFailure: (serviceId: string) => void;
  restoreAllServices: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  publishKafkaEvent: (event: Omit<KafkaEvent, 'eventId' | 'timestamp' | 'offset'>) => KafkaEvent;
  runDemoWorkflow: (scenario: 'SUCCESS' | 'PAYMENT_FAILURE') => Promise<void>;
  closeWorkflowModal: () => void;
  resetDemoData: () => void;
}

const STORAGE_KEY = 'eventflow_enterprise_state_v1';

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initial data
  const loadInitial = <T,>(keySuffix: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${keySuffix}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse from localStorage', e);
    }
    return fallback;
  };

  const [orders, setOrders] = useState<Order[]>(() => loadInitial('orders', INITIAL_ORDERS));
  const [products, setProducts] = useState<Product[]>(() => loadInitial('products', INITIAL_PRODUCTS));
  const [payments, setPayments] = useState<Payment[]>(() => loadInitial('payments', INITIAL_PAYMENTS));
  const [kafkaEvents, setKafkaEvents] = useState<KafkaEvent[]>(() => loadInitial('kafkaEvents', INITIAL_KAFKA_EVENTS));
  const [microservices, setMicroservices] = useState<Microservice[]>(() => loadInitial('microservices', INITIAL_MICROSERVICES));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadInitial('notifications', INITIAL_NOTIFICATIONS));
  const [logs, setLogs] = useState<SystemLog[]>(() => loadInitial('logs', INITIAL_SYSTEM_LOGS));

  const [currentPage, setCurrentPage] = useState<NavPage>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPausedFeed, setIsPausedFeed] = useState(false);

  const [workflowState, setWorkflowState] = useState<WorkflowExecutionState>({
    isActive: false,
    scenario: 'SUCCESS',
    step: 0,
    status: 'IDLE',
    currentAction: '',
    logs: []
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
      localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
      localStorage.setItem(`${STORAGE_KEY}_payments`, JSON.stringify(payments));
      localStorage.setItem(`${STORAGE_KEY}_kafkaEvents`, JSON.stringify(kafkaEvents));
      localStorage.setItem(`${STORAGE_KEY}_microservices`, JSON.stringify(microservices));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(logs));
    } catch (e) {
      console.warn('Failed saving to localStorage', e);
    }
  }, [orders, products, payments, kafkaEvents, microservices, notifications, logs]);

  const addLog = (level: LogLevel, serviceName: string, message: string, correlationId?: string, metadata?: any) => {
    const newLog: SystemLog = {
      id: `log-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
      level,
      serviceName,
      message,
      correlationId: correlationId || `corr-${Math.random().toString(36).substring(2, 8)}`,
      metadata
    };
    setLogs(prev => [newLog, ...prev.slice(0, 199)]);
  };

  const publishKafkaEvent = (evt: Omit<KafkaEvent, 'eventId' | 'timestamp' | 'offset'>): KafkaEvent => {
    const eventId = `evt-${Math.random().toString(36).substring(2, 10)}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const offset = Math.floor(80000 + Math.random() * 20000);

    const fullEvent: KafkaEvent = {
      ...evt,
      eventId,
      timestamp,
      offset
    };

    setKafkaEvents(prev => [fullEvent, ...prev]);

    // Also update Kafka Broker metrics
    setMicroservices(prev =>
      prev.map(ms =>
        ms.id === 'ms-kafka'
          ? { ...ms, requestCount: ms.requestCount + 1, lastHealthCheck: 'Just now' }
          : ms
      )
    );

    return fullEvent;
  };

  const calculateStockStatus = (available: number, threshold: number): StockStatus => {
    if (available <= 0) return 'OUT_OF_STOCK';
    if (available <= threshold) return 'LOW_STOCK';
    return 'IN_STOCK';
  };

  const updateStock = (productId: string, newAvailable: number) => {
    const validQty = Math.max(0, newAvailable);
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const status = calculateStockStatus(validQty, p.minThreshold);
          return {
            ...p,
            availableStock: validQty,
            status,
            lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19)
          };
        }
        return p;
      })
    );

    const prod = products.find(p => p.id === productId);
    if (prod) {
      publishKafkaEvent({
        eventName: 'InventoryUpdated',
        topic: 'inventory.events',
        producerService: 'Inventory Service',
        consumerService: 'Search & Catalog Service',
        partition: 0,
        status: 'PROCESSED',
        correlationId: `corr-stock-${Date.now()}`,
        payload: {
          productId,
          sku: prod.sku,
          newAvailableStock: validQty,
          previousStock: prod.availableStock
        }
      });

      addLog('INFO', 'Inventory Service', `Stock level manually updated for ${prod.sku} to ${validQty}`);

      if (validQty <= prod.minThreshold && validQty > 0) {
        addNotification({
          title: `Low Stock Warning: ${prod.sku}`,
          message: `${prod.name} has dropped to ${validQty} units. Threshold is ${prod.minThreshold}.`,
          type: 'INVENTORY',
          relatedEntityId: productId
        });
      } else if (validQty === 0) {
        addNotification({
          title: `Out of Stock Alert: ${prod.sku}`,
          message: `${prod.name} is now depleted (0 units). Item disabled for checkout.`,
          type: 'ALERT',
          relatedEntityId: productId
        });
      }
    }
  };

  const adjustStockDelta = (productId: string, delta: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const nextVal = Math.max(0, prod.availableStock + delta);
    updateStock(productId, nextVal);
  };

  const addProduct = (productData: Omit<Product, 'id' | 'lastUpdated' | 'status' | 'reservedStock'>) => {
    const newId = `PROD-${Math.floor(100 + products.length + 1)}`;
    const status = calculateStockStatus(productData.availableStock, productData.minThreshold);
    const newProduct: Product = {
      ...productData,
      id: newId,
      reservedStock: 0,
      status,
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setProducts(prev => [newProduct, ...prev]);

    publishKafkaEvent({
      eventName: 'InventoryUpdated',
      topic: 'inventory.events',
      producerService: 'Inventory Service',
      consumerService: 'Catalog Service',
      partition: 0,
      status: 'PROCESSED',
      correlationId: `corr-newprod-${newId}`,
      payload: {
        action: 'PRODUCT_REGISTERED',
        productId: newId,
        sku: newProduct.sku,
        initialStock: newProduct.availableStock
      }
    });

    addLog('INFO', 'Inventory Service', `Registered new catalog product: ${newProduct.name} (${newProduct.sku})`);
    
    addNotification({
      title: 'New Product Registered',
      message: `${newProduct.name} (${newProduct.sku}) added to inventory with ${newProduct.availableStock} units.`,
      type: 'INVENTORY',
      relatedEntityId: newId
    });
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newItem: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      read: false
    };
    setNotifications(prev => [newItem, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const cancelOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || order.orderStatus === 'CANCELLED' || order.orderStatus === 'DELIVERED') return;

    // Release reserved inventory
    setProducts(prev =>
      prev.map(prod => {
        const item = order.items.find(i => i.productId === prod.id);
        if (item) {
          const newAvail = prod.availableStock + item.quantity;
          const newReserved = Math.max(0, prod.reservedStock - item.quantity);
          return {
            ...prod,
            availableStock: newAvail,
            reservedStock: newReserved,
            status: calculateStockStatus(newAvail, prod.minThreshold),
            lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19)
          };
        }
        return prod;
      })
    );

    // Update order status
    const nowTime = new Date().toTimeString().substring(0, 8);
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: 'CANCELLED',
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              timeline: [
                ...o.timeline,
                {
                  title: 'Order Cancelled',
                  service: 'Order Service',
                  status: 'COMPLETED',
                  timestamp: nowTime,
                  description: 'Order cancelled by administrator. Reserved stock released back to inventory.'
                }
              ]
            }
          : o
      )
    );

    publishKafkaEvent({
      eventName: 'OrderCancelled',
      topic: 'order.events',
      producerService: 'Order Service',
      consumerService: 'Inventory Service, Payment Service',
      partition: 0,
      status: 'PROCESSED',
      correlationId: order.correlationId,
      payload: {
        orderId,
        cancelledAt: new Date().toISOString(),
        refundInitiated: order.paymentStatus === 'SUCCESSFUL'
      }
    });

    addLog('WARN', 'Order Service', `Order ${orderId} cancelled. Compensation transaction initiated in Inventory Service.`, order.correlationId);

    addNotification({
      title: `Order Cancelled: ${orderId}`,
      message: `Order for ${order.customerName} has been cancelled and stock released.`,
      type: 'ORDER',
      relatedEntityId: orderId
    });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const nowTime = new Date().toTimeString().substring(0, 8);
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: status,
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              timeline: [
                ...o.timeline,
                {
                  title: `Status: ${status}`,
                  service: 'Order Service',
                  status: 'COMPLETED',
                  timestamp: nowTime,
                  description: `Order manual status override to ${status}`
                }
              ]
            }
          : o
      )
    );
    addLog('INFO', 'Order Service', `Order ${orderId} status updated to ${status}`);
  };

  const toggleServiceFailure = (serviceId: string) => {
    setMicroservices(prev =>
      prev.map(ms => {
        if (ms.id === serviceId) {
          const nextStatus = ms.status === 'HEALTHY' ? 'DOWN' : 'HEALTHY';
          const nextErrorRate = nextStatus === 'DOWN' ? 100 : 0.02;
          const nextRespTime = nextStatus === 'DOWN' ? 0 : 25;

          const correlationId = `corr-health-${serviceId}-${Date.now()}`;

          if (nextStatus === 'DOWN') {
            publishKafkaEvent({
              eventName: 'ServiceUnavailable',
              topic: 'system.events',
              producerService: 'Health Monitor Agent',
              consumerService: 'Alerting & Circuit Breaker',
              partition: 0,
              status: 'FAILED',
              correlationId,
              payload: {
                serviceId: ms.id,
                serviceName: ms.name,
                port: ms.port,
                cause: 'SIMULATED_FAILURE_INJECTION',
                circuitBreaker: 'OPEN'
              }
            });

            addLog('ERROR', ms.name, `FATAL: Service health heartbeat missed on port ${ms.port}. Circuit breaker tripped to OPEN.`, correlationId);

            addNotification({
              title: `Service Down: ${ms.name}`,
              message: `High priority alert: ${ms.name} (Port ${ms.port}) is unresponsive. Fallback circuit active.`,
              type: 'ALERT',
              relatedEntityId: ms.id
            });
          } else {
            publishKafkaEvent({
              eventName: 'ServiceRestored',
              topic: 'system.events',
              producerService: 'Health Monitor Agent',
              consumerService: 'Circuit Breaker',
              partition: 0,
              status: 'PROCESSED',
              correlationId,
              payload: {
                serviceId: ms.id,
                serviceName: ms.name,
                status: 'HEALTHY',
                circuitBreaker: 'CLOSED'
              }
            });

            addLog('INFO', ms.name, `Service recovery verified. Self-healing probe succeeded; circuit breaker reset to CLOSED.`, correlationId);

            addNotification({
              title: `Service Restored: ${ms.name}`,
              message: `${ms.name} has returned to HEALTHY state. Traffic re-routed to primary pod.`,
              type: 'SYSTEM',
              relatedEntityId: ms.id
            });
          }

          return {
            ...ms,
            status: nextStatus,
            errorRatePercent: nextErrorRate,
            responseTimeMs: nextRespTime,
            lastHealthCheck: 'Just now'
          };
        }
        return ms;
      })
    );
  };

  const restoreAllServices = () => {
    setMicroservices(prev =>
      prev.map(ms => ({
        ...ms,
        status: 'HEALTHY',
        errorRatePercent: ms.id === 'ms-payment' ? 0.85 : 0.02,
        responseTimeMs: ms.id === 'ms-payment' ? 65 : 20,
        lastHealthCheck: 'Just now'
      }))
    );
    addLog('INFO', 'Health Monitor', 'Global service restoration executed: all microservice clusters marked HEALTHY');
    addNotification({
      title: 'All Services Healthy',
      message: 'All microservices, databases, and Kafka broker nodes have been verified healthy.',
      type: 'SYSTEM'
    });
  };

  const retryPayment = async (paymentId: string): Promise<boolean> => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return false;

    const corrId = payment.correlationId;
    const nowTime = new Date().toTimeString().substring(0, 8);

    addLog('INFO', 'Payment Service', `Retrying payment for order ${payment.orderId} (Attempt #${payment.retryCount + 1})...`, corrId);

    publishKafkaEvent({
      eventName: 'PaymentInitiated',
      topic: 'payment.events',
      producerService: 'Payment Service',
      consumerService: 'Payment Gateway Client',
      partition: 1,
      status: 'PROCESSED',
      correlationId: corrId,
      payload: {
        paymentId: payment.id,
        orderId: payment.orderId,
        amount: payment.amount,
        isRetry: true,
        attempt: payment.retryCount + 1
      }
    });

    // Small delay to simulate network call
    await new Promise(r => setTimeout(r, 600));

    // Update payment to SUCCESSFUL
    const newTxnRef = `TXN-RETRY-${Math.floor(100000 + Math.random() * 900000)}`;
    setPayments(prev =>
      prev.map(p =>
        p.id === paymentId
          ? {
              ...p,
              status: 'SUCCESSFUL',
              failureReason: undefined,
              transactionRef: newTxnRef,
              retryCount: p.retryCount + 1,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
            }
          : p
      )
    );

    publishKafkaEvent({
      eventName: 'PaymentCompleted',
      topic: 'payment.events',
      producerService: 'Payment Service',
      consumerService: 'Order Service',
      partition: 1,
      status: 'PROCESSED',
      correlationId: corrId,
      payload: {
        paymentId: payment.id,
        orderId: payment.orderId,
        amount: payment.amount,
        transactionRef: newTxnRef,
        status: 'SUCCESSFUL'
      }
    });

    // Update order status to CONFIRMED
    setOrders(prev =>
      prev.map(o =>
        o.id === payment.orderId
          ? {
              ...o,
              paymentStatus: 'SUCCESSFUL',
              orderStatus: 'CONFIRMED',
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              timeline: [
                ...o.timeline,
                {
                  title: 'Payment Retry Successful',
                  service: 'Payment Service',
                  status: 'COMPLETED',
                  timestamp: nowTime,
                  description: `Simulated retry succeeded: ${newTxnRef} authorized.`
                },
                {
                  title: 'Order Confirmed',
                  service: 'Order Service',
                  status: 'COMPLETED',
                  timestamp: nowTime,
                  description: 'Payment verified. Order confirmed for fulfillment.'
                }
              ]
            }
          : o
      )
    );

    publishKafkaEvent({
      eventName: 'OrderConfirmed',
      topic: 'order.events',
      producerService: 'Order Service',
      consumerService: 'Notification Service',
      partition: 0,
      status: 'PROCESSED',
      correlationId: corrId,
      payload: {
        orderId: payment.orderId,
        status: 'CONFIRMED'
      }
    });

    addLog('INFO', 'Order Service', `Order ${payment.orderId} successfully transitioned to CONFIRMED following payment retry.`, corrId);

    addNotification({
      title: `Payment Succeeded: ${payment.orderId}`,
      message: `Retry successful for $${payment.amount.toFixed(2)}. Order confirmed.`,
      type: 'PAYMENT',
      relatedEntityId: payment.orderId
    });

    return true;
  };

  // Place order with full asynchronous event flow
  const placeOrder = async (orderData: {
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    items: { productId: string; quantity: number }[];
    paymentMethod: 'Credit Card' | 'UPI / NetBanking' | 'Corporate PO' | 'Digital Wallet';
  }): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    // 1. Stock validation
    for (const item of orderData.items) {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) return { success: false, error: `Product ${item.productId} not found.` };
      if (prod.availableStock < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for ${prod.name}. Requested: ${item.quantity}, Available: ${prod.availableStock}`
        };
      }
    }

    const orderId = `ORD-2026-${Math.floor(8906 + orders.length)}`;
    const correlationId = `corr-${orderId.toLowerCase()}-${Math.random().toString(36).substring(2, 8)}`;
    const nowTime = new Date().toTimeString().substring(0, 8);
    const createdTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Calculate item details & total
    let totalAmount = 0;
    const orderItems = orderData.items.map(item => {
      const prod = products.find(p => p.id === item.productId)!;
      const totalPrice = prod.price * item.quantity;
      totalAmount += totalPrice;
      return {
        productId: prod.id,
        productName: prod.name,
        category: prod.category,
        quantity: item.quantity,
        unitPrice: prod.price,
        totalPrice
      };
    });

    // 1. Create order initial record
    const newOrder: Order = {
      id: orderId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      shippingAddress: orderData.shippingAddress,
      items: orderItems,
      totalAmount: Math.round(totalAmount * 100) / 100,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'PENDING',
      orderStatus: 'PLACED',
      createdAt: createdTimestamp,
      updatedAt: createdTimestamp,
      correlationId,
      timeline: [
        {
          title: 'Order Placed',
          service: 'Order Service',
          status: 'COMPLETED',
          timestamp: nowTime,
          description: `Order registered in Order Service; emitted OrderPlaced event to Kafka.`
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);

    // Step A: Publish OrderPlaced to Kafka
    const orderPlacedEvt = publishKafkaEvent({
      eventName: 'OrderPlaced',
      topic: 'order.events',
      producerService: 'Order Service',
      consumerService: 'Inventory Service',
      partition: 0,
      status: 'PROCESSED',
      correlationId,
      payload: {
        orderId,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        totalAmount: newOrder.totalAmount,
        items: orderItems.map(i => ({ productId: i.productId, qty: i.quantity, price: i.unitPrice }))
      }
    });

    addLog('INFO', 'Order Service', `Created order ${orderId} for ${orderData.customerName} ($${newOrder.totalAmount.toFixed(2)}). Emitted OrderPlaced.`, correlationId);

    // Simulate async hop to Inventory Service
    await new Promise(r => setTimeout(r, 400));

    // Step B: Inventory Service consumes event and reserves stock
    setProducts(prev =>
      prev.map(prod => {
        const item = orderItems.find(i => i.productId === prod.id);
        if (item) {
          const newAvail = Math.max(0, prod.availableStock - item.quantity);
          const newReserved = prod.reservedStock + item.quantity;
          return {
            ...prod,
            availableStock: newAvail,
            reservedStock: newReserved,
            status: calculateStockStatus(newAvail, prod.minThreshold),
            lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19)
          };
        }
        return prod;
      })
    );

    const invTime = new Date().toTimeString().substring(0, 8);
    const invEvt = publishKafkaEvent({
      eventName: 'InventoryReserved',
      topic: 'inventory.events',
      producerService: 'Inventory Service',
      consumerService: 'Payment Service',
      partition: 0,
      status: 'PROCESSED',
      correlationId,
      payload: {
        orderId,
        warehouse: 'WH-PRIMARY-01',
        reservedItems: orderItems.map(i => ({ productId: i.productId, quantity: i.quantity }))
      }
    });

    addLog('INFO', 'Inventory Service', `Reserved stock for order ${orderId}. Emitted InventoryReserved.`, correlationId);

    // Update order timeline step 2
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: 'PROCESSING',
              timeline: [
                ...o.timeline,
                {
                  title: 'Inventory Reserved',
                  service: 'Inventory Service',
                  status: 'COMPLETED',
                  timestamp: invTime,
                  description: 'SKU quantities allocated and reservation lock acquired.',
                  eventId: invEvt.eventId
                }
              ]
            }
          : o
      )
    );

    // Simulate async hop to Payment Service
    await new Promise(r => setTimeout(r, 450));

    // Step C: Payment Service processes transaction
    const paymentId = `PAY-${Math.floor(40896 + payments.length)}`;
    const txnRef = `TXN-DEMO-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const payTime = new Date().toTimeString().substring(0, 8);

    const newPayment: Payment = {
      id: paymentId,
      orderId,
      customerName: orderData.customerName,
      amount: newOrder.totalAmount,
      paymentMethod: orderData.paymentMethod,
      status: 'SUCCESSFUL',
      transactionRef: txnRef,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      retryCount: 0,
      correlationId
    };

    setPayments(prev => [newPayment, ...prev]);

    publishKafkaEvent({
      eventName: 'PaymentCompleted',
      topic: 'payment.events',
      producerService: 'Payment Service',
      consumerService: 'Order Service',
      partition: 1,
      status: 'PROCESSED',
      correlationId,
      payload: {
        paymentId,
        orderId,
        amount: newOrder.totalAmount,
        transactionRef: txnRef,
        method: orderData.paymentMethod
      }
    });

    addLog('INFO', 'Payment Service', `Processed payment ${paymentId} for order ${orderId} ($${newOrder.totalAmount.toFixed(2)}).`, correlationId);

    // Simulate async hop to Order Service confirmation
    await new Promise(r => setTimeout(r, 350));

    // Step D: Order Service updates to CONFIRMED
    const confTime = new Date().toTimeString().substring(0, 8);
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              paymentStatus: 'SUCCESSFUL',
              orderStatus: 'CONFIRMED',
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              timeline: [
                ...o.timeline,
                {
                  title: 'Payment Processed',
                  service: 'Payment Service',
                  status: 'COMPLETED',
                  timestamp: payTime,
                  description: `Simulated transaction approved (${txnRef}).`
                },
                {
                  title: 'Order Confirmed',
                  service: 'Order Service',
                  status: 'COMPLETED',
                  timestamp: confTime,
                  description: 'Order confirmed and ready for warehouse dispatch.'
                }
              ]
            }
          : o
      )
    );

    publishKafkaEvent({
      eventName: 'OrderConfirmed',
      topic: 'order.events',
      producerService: 'Order Service',
      consumerService: 'Notification Service',
      partition: 0,
      status: 'PROCESSED',
      correlationId,
      payload: {
        orderId,
        status: 'CONFIRMED',
        totalAmount: newOrder.totalAmount
      }
    });

    addLog('INFO', 'Order Service', `Order ${orderId} confirmed. Published OrderConfirmed event to Kafka.`, correlationId);

    // Step E: Notification Service sends confirmation
    await new Promise(r => setTimeout(r, 300));
    const notifTime = new Date().toTimeString().substring(0, 8);

    publishKafkaEvent({
      eventName: 'NotificationSent',
      topic: 'notification.events',
      producerService: 'Notification Service',
      consumerService: 'Audit & Analytics Service',
      partition: 2,
      status: 'PROCESSED',
      correlationId,
      payload: {
        recipient: orderData.customerEmail,
        orderId,
        template: 'ORDER_CONFIRMATION',
        channel: 'EMAIL'
      }
    });

    addLog('INFO', 'Notification Service', `Dispatched confirmation email to ${orderData.customerEmail} for order ${orderId}.`, correlationId);

    addNotification({
      title: `Order Placed: ${orderId}`,
      message: `Order for ${orderData.customerName} ($${newOrder.totalAmount.toFixed(2)}) processed and confirmed.`,
      type: 'ORDER',
      relatedEntityId: orderId
    });

    // Update timeline step 5
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              timeline: [
                ...o.timeline,
                {
                  title: 'Notification Dispatched',
                  service: 'Notification Service',
                  status: 'COMPLETED',
                  timestamp: notifTime,
                  description: `Email confirmation sent to ${orderData.customerEmail}.`
                }
              ]
            }
          : o
      )
    );

    return { success: true, orderId };
  };

  // Demo Workflow runner for presentation mode
  const runDemoWorkflow = async (scenario: 'SUCCESS' | 'PAYMENT_FAILURE') => {
    setWorkflowState({
      isActive: true,
      scenario,
      step: 1,
      status: 'RUNNING',
      currentAction: 'Initiating demo workflow: Creating enterprise order...',
      logs: ['[00.00s] Workflow triggered by demonstrator']
    });

    const sampleOrderItems = [
      { productId: 'PROD-101', quantity: 1 } // Dell UltraSharp 34" Monitor ($849.99)
    ];

    const customerName = scenario === 'SUCCESS' ? 'Dr. Aris Thorne' : 'Cassian Brooks';
    const customerEmail = scenario === 'SUCCESS' ? 'a.thorne@quantumlabs.org' : 'cassian.b@nebula-media.co';
    const shippingAddress = '742 Enterprise Way, Silicon Valley, CA 94025';

    try {
      // Step 1: OrderPlaced
      await new Promise(r => setTimeout(r, 600));
      setWorkflowState(prev => ({
        ...prev,
        step: 2,
        currentAction: 'Step 1/5: Order Service accepted request. Publishing OrderPlaced event to Kafka...',
        logs: [...prev.logs, '[00.60s] Order Service received POST /api/v1/orders -> Emitting OrderPlaced to topic order.events (Partition 0)']
      }));

      // Call placeOrder or simulate failure
      if (scenario === 'SUCCESS') {
        const result = await placeOrder({
          customerName,
          customerEmail,
          shippingAddress,
          items: sampleOrderItems,
          paymentMethod: 'Credit Card'
        });

        await new Promise(r => setTimeout(r, 600));
        setWorkflowState(prev => ({
          ...prev,
          step: 5,
          status: 'SUCCESS',
          orderId: result.orderId,
          currentAction: `Workflow complete! Order ${result.orderId} processed seamlessly through all 5 microservices.`,
          logs: [
            ...prev.logs,
            `[01.20s] Inventory Service consumed event: Stock reserved for PROD-101`,
            `[01.80s] Payment Service consumed event: Simulated Credit Card authorized ($849.99)`,
            `[02.40s] Order Service received PaymentCompleted: Order transitioned to CONFIRMED`,
            `[03.00s] Notification Service dispatched transactional confirmation to ${customerEmail}`,
            `[03.10s] SAGA Transaction COMPLETED successfully`
          ]
        }));
      } else {
        // Controlled Failure Scenario
        const failedOrderId = `ORD-2026-${Math.floor(8906 + orders.length)}`;
        const corrId = `corr-fail-${Date.now()}`;
        const prod = products.find(p => p.id === 'PROD-103') || products[0];

        // 1. OrderPlaced
        const failedOrder: Order = {
          id: failedOrderId,
          customerName,
          customerEmail,
          shippingAddress,
          items: [
            {
              productId: prod.id,
              productName: prod.name,
              category: prod.category,
              quantity: 1,
              unitPrice: prod.price,
              totalPrice: prod.price
            }
          ],
          totalAmount: prod.price,
          paymentMethod: 'Credit Card',
          paymentStatus: 'FAILED',
          orderStatus: 'PROCESSING',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          correlationId: corrId,
          timeline: [
            {
              title: 'Order Placed',
              service: 'Order Service',
              status: 'COMPLETED',
              timestamp: new Date().toTimeString().substring(0, 8),
              description: 'Order placed, awaiting payment authorization'
            }
          ]
        };

        setOrders(prev => [failedOrder, ...prev]);

        publishKafkaEvent({
          eventName: 'OrderPlaced',
          topic: 'order.events',
          producerService: 'Order Service',
          consumerService: 'Inventory Service',
          partition: 0,
          status: 'PROCESSED',
          correlationId: corrId,
          payload: { orderId: failedOrderId, customerName, totalAmount: prod.price }
        });

        // Step 2: Inventory Reserved (temporary hold)
        await new Promise(r => setTimeout(r, 600));
        setWorkflowState(prev => ({
          ...prev,
          step: 3,
          currentAction: 'Step 2/5: Inventory Service reserved temporary hold. Forwarding to Payment Service...',
          logs: [...prev.logs, `[01.20s] Inventory Service reserved 1 unit of ${prod.sku} on 30-min hold`]
        }));

        publishKafkaEvent({
          eventName: 'InventoryReserved',
          topic: 'inventory.events',
          producerService: 'Inventory Service',
          consumerService: 'Payment Service',
          partition: 0,
          status: 'PROCESSED',
          correlationId: corrId,
          payload: { orderId: failedOrderId, status: 'HELD' }
        });

        // Step 3: Payment Fails
        await new Promise(r => setTimeout(r, 700));
        const failedPayId = `PAY-${Math.floor(40896 + payments.length)}`;

        const paymentRec: Payment = {
          id: failedPayId,
          orderId: failedOrderId,
          customerName,
          amount: prod.price,
          paymentMethod: 'Credit Card',
          status: 'FAILED',
          transactionRef: `TXN-FAIL-${Math.floor(100000 + Math.random() * 900000)}`,
          failureReason: 'Card issuer rejected transaction: insufficient available balance (code 402)',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          retryCount: 0,
          correlationId: corrId
        };

        setPayments(prev => [paymentRec, ...prev]);

        publishKafkaEvent({
          eventName: 'PaymentFailed',
          topic: 'payment.events',
          producerService: 'Payment Service',
          consumerService: 'Order Service, Notification Service',
          partition: 1,
          status: 'FAILED',
          correlationId: corrId,
          payload: {
            paymentId: failedPayId,
            orderId: failedOrderId,
            amount: prod.price,
            errorCode: 'INSUFFICIENT_FUNDS'
          }
        });

        addLog('ERROR', 'Payment Service', `Payment declined for order ${failedOrderId}: insufficient funds. Emitted PaymentFailed.`, corrId);

        addNotification({
          title: `Payment Failed: ${failedOrderId}`,
          message: `Payment charge for $${prod.price.toFixed(2)} failed. Retry available in Payments dashboard.`,
          type: 'ALERT',
          relatedEntityId: failedOrderId
        });

        setWorkflowState(prev => ({
          ...prev,
          step: 4,
          status: 'FAILED',
          orderId: failedOrderId,
          currentAction: `Simulation complete: Controlled payment failure demonstrated. Order placed in retry hold.`,
          logs: [
            ...prev.logs,
            `[01.80s] Payment Service gateway simulation triggered Card Declined (402)`,
            `[02.00s] Emitted PaymentFailed to topic payment.events`,
            `[02.10s] Order Service received PaymentFailed event -> Keeps order in PROCESSING state with retry button enabled`,
            `[02.20s] Notification and System Logs updated with alert`
          ]
        }));
      }
    } catch (err: any) {
      setWorkflowState(prev => ({
        ...prev,
        status: 'FAILED',
        currentAction: `Workflow error: ${err.message || 'Unknown error'}`
      }));
    }
  };

  const closeWorkflowModal = () => {
    setWorkflowState(prev => ({ ...prev, isActive: false }));
  };

  const resetDemoData = () => {
    setOrders(INITIAL_ORDERS);
    setProducts(INITIAL_PRODUCTS);
    setPayments(INITIAL_PAYMENTS);
    setKafkaEvents(INITIAL_KAFKA_EVENTS);
    setMicroservices(INITIAL_MICROSERVICES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setLogs(INITIAL_SYSTEM_LOGS);

    try {
      localStorage.removeItem(`${STORAGE_KEY}_orders`);
      localStorage.removeItem(`${STORAGE_KEY}_products`);
      localStorage.removeItem(`${STORAGE_KEY}_payments`);
      localStorage.removeItem(`${STORAGE_KEY}_kafkaEvents`);
      localStorage.removeItem(`${STORAGE_KEY}_microservices`);
      localStorage.removeItem(`${STORAGE_KEY}_notifications`);
      localStorage.removeItem(`${STORAGE_KEY}_logs`);
    } catch (e) {
      console.warn('Failed clearing localStorage', e);
    }

    addNotification({
      title: 'Demo Environment Reset',
      message: 'All sample orders, products, events, and health metrics restored to initial baseline state.',
      type: 'SYSTEM'
    });
  };

  return (
    <AppContext.Provider
      value={{
        orders,
        products,
        payments,
        kafkaEvents,
        microservices,
        notifications,
        logs,
        currentPage,
        setCurrentPage,
        searchTerm,
        setSearchTerm,
        isPausedFeed,
        setIsPausedFeed,
        workflowState,
        placeOrder,
        cancelOrder,
        updateOrderStatus,
        updateStock,
        adjustStockDelta,
        addProduct,
        retryPayment,
        toggleServiceFailure,
        restoreAllServices,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        publishKafkaEvent,
        runDemoWorkflow,
        closeWorkflowModal,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
