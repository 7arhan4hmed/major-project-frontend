import { Order, Product, Payment, KafkaEvent, NotificationItem, Microservice, SystemLog } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'PROD-101',
    sku: 'HW-DISP-34C',
    name: 'Dell UltraSharp 34" Curved USB-C Hub Monitor',
    category: 'Displays & Peripherals',
    price: 849.99,
    availableStock: 38,
    reservedStock: 4,
    minThreshold: 10,
    status: 'IN_STOCK',
    lastUpdated: '2026-10-16 18:45:00',
    description: 'WQHD IPS Black panel with 90W power delivery and RJ45 ethernet hub.'
  },
  {
    id: 'PROD-102',
    sku: 'SRV-SSD-4TB',
    name: 'Samsung PM9A3 3.84TB PCIe 4.0 NVMe Enterprise SSD',
    category: 'Storage & Memory',
    price: 489.00,
    availableStock: 74,
    reservedStock: 12,
    minThreshold: 15,
    status: 'IN_STOCK',
    lastUpdated: '2026-10-16 17:30:12',
    description: 'U.2 enterprise datacenter SSD with power-loss protection and end-to-end data encryption.'
  },
  {
    id: 'PROD-103',
    sku: 'NET-SW-24P',
    name: 'Ubiquiti UniFi Pro 24-Port PoE Gigabit Switch',
    category: 'Enterprise Networking',
    price: 699.00,
    availableStock: 6,
    reservedStock: 2,
    minThreshold: 8,
    status: 'LOW_STOCK',
    lastUpdated: '2026-10-16 16:15:40',
    description: 'Managed Layer 3 switch with 10G SFP+ uplinks and 400W total PoE availability.'
  },
  {
    id: 'PROD-104',
    sku: 'ACC-KEY-PRO',
    name: 'Keychron Q3 Pro Wireless QMK Custom Mechanical Keyboard',
    category: 'Displays & Peripherals',
    price: 219.50,
    availableStock: 52,
    reservedStock: 5,
    minThreshold: 12,
    status: 'IN_STOCK',
    lastUpdated: '2026-10-16 15:10:05',
    description: 'Full CNC aluminum body, hot-swappable tactile switches, and Bluetooth 5.1 dual connectivity.'
  },
  {
    id: 'PROD-105',
    sku: 'PWR-UPS-3000',
    name: 'APC Smart-UPS On-Line 3000VA 230V Rackmount',
    category: 'Power & Infrastructure',
    price: 1845.00,
    availableStock: 2,
    reservedStock: 1,
    minThreshold: 5,
    status: 'LOW_STOCK',
    lastUpdated: '2026-10-16 14:02:18',
    description: 'Double-conversion online power protection with LCD console and network management card.'
  },
  {
    id: 'PROD-106',
    sku: 'SEC-CAM-4K',
    name: 'Axis P3268-LVE Outdoor 4K Dome Network Camera',
    category: 'Security & IoT',
    price: 920.00,
    availableStock: 0,
    reservedStock: 0,
    minThreshold: 5,
    status: 'OUT_OF_STOCK',
    lastUpdated: '2026-10-16 11:20:00',
    description: 'Deep learning processing unit (DLPU) with OptimizedIR and Lightfinder 2.0.'
  },
  {
    id: 'PROD-107',
    sku: 'AUD-ANC-XM5',
    name: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
    category: 'Displays & Peripherals',
    price: 398.00,
    availableStock: 41,
    reservedStock: 3,
    minThreshold: 10,
    status: 'IN_STOCK',
    lastUpdated: '2026-10-16 18:10:22',
    description: 'Industry-leading dual processor noise cancelling with 8 microphones and LDAC support.'
  },
  {
    id: 'PROD-108',
    sku: 'CMP-DOCK-TB4',
    name: 'CalDigit TS4 Thunderbolt 4 Station 18-in-1 Hub',
    category: 'Displays & Peripherals',
    price: 399.95,
    availableStock: 19,
    reservedStock: 1,
    minThreshold: 6,
    status: 'IN_STOCK',
    lastUpdated: '2026-10-16 13:45:10',
    description: '98W charging, 2.5 Gigabit Ethernet, dual 6K display support, and UHS-II SD card slot.'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2026-8901',
    customerName: 'Sarah Jenkins',
    customerEmail: 's.jenkins@acmecorp.com',
    shippingAddress: 'Acme Corp HQ, Suite 400, Seattle, WA 98101',
    items: [
      {
        productId: 'PROD-101',
        productName: 'Dell UltraSharp 34" Curved USB-C Hub Monitor',
        category: 'Displays & Peripherals',
        quantity: 2,
        unitPrice: 849.99,
        totalPrice: 1699.98
      },
      {
        productId: 'PROD-108',
        productName: 'CalDigit TS4 Thunderbolt 4 Station 18-in-1 Hub',
        category: 'Displays & Peripherals',
        quantity: 1,
        unitPrice: 399.95,
        totalPrice: 399.95
      }
    ],
    totalAmount: 2099.93,
    paymentMethod: 'Corporate PO',
    paymentStatus: 'SUCCESSFUL',
    orderStatus: 'CONFIRMED',
    createdAt: '2026-10-16 18:32:10',
    updatedAt: '2026-10-16 18:32:14',
    correlationId: 'corr-8901-7fa1e9',
    timeline: [
      {
        title: 'Order Placed',
        service: 'Order Service',
        status: 'COMPLETED',
        timestamp: '18:32:10',
        description: 'Order created and published to order.events topic',
        eventId: 'evt-ord-8901-01'
      },
      {
        title: 'Inventory Reserved',
        service: 'Inventory Service',
        status: 'COMPLETED',
        timestamp: '18:32:11',
        description: 'Reserved 2x PROD-101 and 1x PROD-108 in warehouse WH-WEST',
        eventId: 'evt-inv-8901-02'
      },
      {
        title: 'Payment Processed',
        service: 'Payment Service',
        status: 'COMPLETED',
        timestamp: '18:32:13',
        description: 'Corporate PO verified and authorized ($2,099.93)',
        eventId: 'evt-pay-8901-03'
      },
      {
        title: 'Order Confirmed',
        service: 'Order Service',
        status: 'COMPLETED',
        timestamp: '18:32:14',
        description: 'Status transitioned to CONFIRMED; dispatch queue queued',
        eventId: 'evt-ord-8901-04'
      },
      {
        title: 'Confirmation Dispatched',
        service: 'Notification Service',
        status: 'COMPLETED',
        timestamp: '18:32:14',
        description: 'Customer notification email sent via SendGrid SMTP cluster',
        eventId: 'evt-not-8901-05'
      }
    ]
  },
  {
    id: 'ORD-2026-8902',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.vance@vancetech.io',
    shippingAddress: 'Vance Data Labs, 88 Mission St, San Francisco, CA 94105',
    items: [
      {
        productId: 'PROD-102',
        productName: 'Samsung PM9A3 3.84TB PCIe 4.0 NVMe Enterprise SSD',
        category: 'Storage & Memory',
        quantity: 4,
        unitPrice: 489.00,
        totalPrice: 1956.00
      }
    ],
    totalAmount: 1956.00,
    paymentMethod: 'Credit Card',
    paymentStatus: 'SUCCESSFUL',
    orderStatus: 'SHIPPED',
    createdAt: '2026-10-16 17:15:20',
    updatedAt: '2026-10-16 17:45:00',
    correlationId: 'corr-8902-3c82d4',
    timeline: [
      {
        title: 'Order Placed',
        service: 'Order Service',
        status: 'COMPLETED',
        timestamp: '17:15:20',
        description: 'Event OrderPlaced published to Kafka partition 1',
        eventId: 'evt-ord-8902-01'
      },
      {
        title: 'Inventory Reserved',
        service: 'Inventory Service',
        status: 'COMPLETED',
        timestamp: '17:15:21',
        description: 'Stock allocated in primary DC-02 vault',
        eventId: 'evt-inv-8902-02'
      },
      {
        title: 'Payment Processed',
        service: 'Payment Service',
        status: 'COMPLETED',
        timestamp: '17:15:22',
        description: 'Card ending in 4242 authorized ($1,956.00)',
        eventId: 'evt-pay-8902-03'
      },
      {
        title: 'Shipment Created',
        service: 'Logistics Service',
        status: 'COMPLETED',
        timestamp: '17:45:00',
        description: 'FedEx Tracking: FX-9028-1192',
        eventId: 'evt-log-8902-04'
      }
    ]
  },
  {
    id: 'ORD-2026-8903',
    customerName: 'Elena Rostova',
    customerEmail: 'e.rostova@cloudmatrix.org',
    shippingAddress: 'CloudMatrix Research, 500 Tech Blvd, Austin, TX 78701',
    items: [
      {
        productId: 'PROD-103',
        productName: 'Ubiquiti UniFi Pro 24-Port PoE Gigabit Switch',
        category: 'Enterprise Networking',
        quantity: 1,
        unitPrice: 699.00,
        totalPrice: 699.00
      }
    ],
    totalAmount: 699.00,
    paymentMethod: 'Credit Card',
    paymentStatus: 'FAILED',
    orderStatus: 'PROCESSING',
    createdAt: '2026-10-16 16:40:05',
    updatedAt: '2026-10-16 16:40:08',
    correlationId: 'corr-8903-fa9102',
    timeline: [
      {
        title: 'Order Placed',
        service: 'Order Service',
        status: 'COMPLETED',
        timestamp: '16:40:05',
        description: 'Order created, awaiting payment authorization',
        eventId: 'evt-ord-8903-01'
      },
      {
        title: 'Inventory Reserved',
        service: 'Inventory Service',
        status: 'COMPLETED',
        timestamp: '16:40:06',
        description: '1x PROD-103 reserved under temporary hold',
        eventId: 'evt-inv-8903-02'
      },
      {
        title: 'Payment Attempt Failed',
        service: 'Payment Service',
        status: 'FAILED',
        timestamp: '16:40:08',
        description: 'Gateway returned 402: Card declined - insufficient funds',
        eventId: 'evt-pay-8903-03'
      }
    ]
  },
  {
    id: 'ORD-2026-8904',
    customerName: 'David Kalu',
    customerEmail: 'kalu.d@zenithfin.com',
    shippingAddress: 'Zenith Financial Towers, Floor 18, New York, NY 10005',
    items: [
      {
        productId: 'PROD-104',
        productName: 'Keychron Q3 Pro Wireless QMK Custom Mechanical Keyboard',
        category: 'Displays & Peripherals',
        quantity: 3,
        unitPrice: 219.50,
        totalPrice: 658.50
      },
      {
        productId: 'PROD-107',
        productName: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
        category: 'Displays & Peripherals',
        quantity: 2,
        unitPrice: 398.00,
        totalPrice: 796.00
      }
    ],
    totalAmount: 1454.50,
    paymentMethod: 'UPI / NetBanking',
    paymentStatus: 'SUCCESSFUL',
    orderStatus: 'DELIVERED',
    createdAt: '2026-10-16 14:22:15',
    updatedAt: '2026-10-16 17:10:00',
    correlationId: 'corr-8904-9812e1',
    timeline: [
      {
        title: 'Order Placed',
        service: 'Order Service',
        status: 'COMPLETED',
        timestamp: '14:22:15',
        description: 'Order placed by corporate purchaser',
        eventId: 'evt-ord-8904-01'
      },
      {
        title: 'Inventory Reserved',
        service: 'Inventory Service',
        status: 'COMPLETED',
        timestamp: '14:22:16',
        description: 'Allocated from East Coast fulfillment hub',
        eventId: 'evt-inv-8904-02'
      },
      {
        title: 'Payment Processed',
        service: 'Payment Service',
        status: 'COMPLETED',
        timestamp: '14:22:18',
        description: 'NetBanking ACH settlement confirmed',
        eventId: 'evt-pay-8904-03'
      },
      {
        title: 'Delivered',
        service: 'Logistics Service',
        status: 'COMPLETED',
        timestamp: '17:10:00',
        description: 'Delivered to reception desk and signed by J. Miller',
        eventId: 'evt-not-8904-04'
      }
    ]
  },
  {
    id: 'ORD-2026-8905',
    customerName: 'Amina Al-Mansoor',
    customerEmail: 'amina.mansoor@gulfinfra.ae',
    shippingAddress: 'DIFC Tower 2, Level 14, Dubai, UAE',
    items: [
      {
        productId: 'PROD-105',
        productName: 'APC Smart-UPS On-Line 3000VA 230V Rackmount',
        category: 'Power & Infrastructure',
        quantity: 1,
        unitPrice: 1845.00,
        totalPrice: 1845.00
      }
    ],
    totalAmount: 1845.00,
    paymentMethod: 'Corporate PO',
    paymentStatus: 'PENDING',
    orderStatus: 'PLACED',
    createdAt: '2026-10-16 18:48:30',
    updatedAt: '2026-10-16 18:48:30',
    correlationId: 'corr-8905-1845aa',
    timeline: [
      {
        title: 'Order Placed',
        service: 'Order Service',
        status: 'COMPLETED',
        timestamp: '18:48:30',
        description: 'PO verification initiated with finance department',
        eventId: 'evt-ord-8905-01'
      },
      {
        title: 'Inventory Reserved',
        service: 'Inventory Service',
        status: 'COMPLETED',
        timestamp: '18:48:32',
        description: '1x PROD-105 placed on 24-hour reservation hold',
        eventId: 'evt-inv-8905-02'
      },
      {
        title: 'Payment Pending',
        service: 'Payment Service',
        status: 'IN_PROGRESS',
        timestamp: '18:48:33',
        description: 'Awaiting corporate wire confirmation',
        eventId: 'evt-pay-8905-03'
      }
    ]
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'PAY-40891',
    orderId: 'ORD-2026-8901',
    customerName: 'Sarah Jenkins',
    amount: 2099.93,
    paymentMethod: 'Corporate PO',
    status: 'SUCCESSFUL',
    transactionRef: 'TXN-CPO-9021884',
    timestamp: '2026-10-16 18:32:13',
    retryCount: 0,
    correlationId: 'corr-8901-7fa1e9'
  },
  {
    id: 'PAY-40892',
    orderId: 'ORD-2026-8902',
    customerName: 'Marcus Vance',
    amount: 1956.00,
    paymentMethod: 'Credit Card',
    status: 'SUCCESSFUL',
    transactionRef: 'ch_3N8xYk2eZvKYlo2C1',
    timestamp: '2026-10-16 17:15:22',
    retryCount: 0,
    correlationId: 'corr-8902-3c82d4'
  },
  {
    id: 'PAY-40893',
    orderId: 'ORD-2026-8903',
    customerName: 'Elena Rostova',
    amount: 699.00,
    paymentMethod: 'Credit Card',
    status: 'FAILED',
    transactionRef: 'ch_3N8xZa0kXvLYmp991',
    failureReason: 'Insufficient funds on credit account (Code: card_declined)',
    timestamp: '2026-10-16 16:40:08',
    retryCount: 1,
    correlationId: 'corr-8903-fa9102'
  },
  {
    id: 'PAY-40894',
    orderId: 'ORD-2026-8904',
    customerName: 'David Kalu',
    amount: 1454.50,
    paymentMethod: 'UPI / NetBanking',
    status: 'SUCCESSFUL',
    transactionRef: 'TXN-UPI-77490210',
    timestamp: '2026-10-16 14:22:18',
    retryCount: 0,
    correlationId: 'corr-8904-9812e1'
  },
  {
    id: 'PAY-40895',
    orderId: 'ORD-2026-8905',
    customerName: 'Amina Al-Mansoor',
    amount: 1845.00,
    paymentMethod: 'Corporate PO',
    status: 'PENDING',
    transactionRef: 'TXN-CPO-PENDING-05',
    timestamp: '2026-10-16 18:48:33',
    retryCount: 0,
    correlationId: 'corr-8905-1845aa'
  }
];

export const INITIAL_KAFKA_EVENTS: KafkaEvent[] = [
  {
    eventId: 'evt-not-8901-05',
    eventName: 'NotificationSent',
    topic: 'notification.events',
    producerService: 'Notification Service',
    consumerService: 'Audit & Analytics Service',
    partition: 2,
    offset: 14892,
    status: 'PROCESSED',
    timestamp: '2026-10-16 18:32:14',
    correlationId: 'corr-8901-7fa1e9',
    payload: {
      notificationId: 'notif-99120',
      recipient: 's.jenkins@acmecorp.com',
      channel: 'EMAIL_SMTP',
      template: 'ORDER_CONFIRMATION_V2',
      orderId: 'ORD-2026-8901',
      dispatchLatencyMs: 142
    }
  },
  {
    eventId: 'evt-ord-8901-04',
    eventName: 'OrderConfirmed',
    topic: 'order.events',
    producerService: 'Order Service',
    consumerService: 'Notification Service, Fulfillment Service',
    partition: 0,
    offset: 89410,
    status: 'PROCESSED',
    timestamp: '2026-10-16 18:32:14',
    correlationId: 'corr-8901-7fa1e9',
    payload: {
      orderId: 'ORD-2026-8901',
      status: 'CONFIRMED',
      totalAmount: 2099.93,
      paymentRef: 'TXN-CPO-9021884',
      itemCount: 2
    }
  },
  {
    eventId: 'evt-pay-8901-03',
    eventName: 'PaymentCompleted',
    topic: 'payment.events',
    producerService: 'Payment Service',
    consumerService: 'Order Service',
    partition: 1,
    offset: 54109,
    status: 'PROCESSED',
    timestamp: '2026-10-16 18:32:13',
    correlationId: 'corr-8901-7fa1e9',
    payload: {
      paymentId: 'PAY-40891',
      orderId: 'ORD-2026-8901',
      amount: 2099.93,
      currency: 'USD',
      method: 'Corporate PO',
      authCode: 'AUTH-PO-APPROVED'
    }
  },
  {
    eventId: 'evt-inv-8901-02',
    eventName: 'InventoryReserved',
    topic: 'inventory.events',
    producerService: 'Inventory Service',
    consumerService: 'Payment Service',
    partition: 0,
    offset: 32019,
    status: 'PROCESSED',
    timestamp: '2026-10-16 18:32:11',
    correlationId: 'corr-8901-7fa1e9',
    payload: {
      orderId: 'ORD-2026-8901',
      warehouseId: 'WH-WEST-01',
      reservedItems: [
        { sku: 'HW-DISP-34C', qty: 2 },
        { sku: 'CMP-DOCK-TB4', qty: 1 }
      ],
      reservationExpiry: '2026-10-16T19:02:11Z'
    }
  },
  {
    eventId: 'evt-ord-8901-01',
    eventName: 'OrderPlaced',
    topic: 'order.events',
    producerService: 'Order Service',
    consumerService: 'Inventory Service',
    partition: 0,
    offset: 89409,
    status: 'PROCESSED',
    timestamp: '2026-10-16 18:32:10',
    correlationId: 'corr-8901-7fa1e9',
    payload: {
      orderId: 'ORD-2026-8901',
      customerId: 'CUST-ACME-401',
      customerEmail: 's.jenkins@acmecorp.com',
      totalAmount: 2099.93,
      items: [
        { productId: 'PROD-101', quantity: 2, unitPrice: 849.99 },
        { productId: 'PROD-108', quantity: 1, unitPrice: 399.95 }
      ]
    }
  },
  {
    eventId: 'evt-pay-8903-03',
    eventName: 'PaymentFailed',
    topic: 'payment.events',
    producerService: 'Payment Service',
    consumerService: 'Order Service, Notification Service',
    partition: 1,
    offset: 54108,
    status: 'FAILED',
    timestamp: '2026-10-16 16:40:08',
    correlationId: 'corr-8903-fa9102',
    payload: {
      paymentId: 'PAY-40893',
      orderId: 'ORD-2026-8903',
      amount: 699.00,
      currency: 'USD',
      errorCode: 'CARD_DECLINED_INSUFFICIENT_FUNDS',
      retryEligible: true
    }
  },
  {
    eventId: 'evt-inv-8903-02',
    eventName: 'InventoryReserved',
    topic: 'inventory.events',
    producerService: 'Inventory Service',
    consumerService: 'Payment Service',
    partition: 0,
    offset: 32018,
    status: 'PROCESSED',
    timestamp: '2026-10-16 16:40:06',
    correlationId: 'corr-8903-fa9102',
    payload: {
      orderId: 'ORD-2026-8903',
      warehouseId: 'WH-CENTRAL',
      reservedItems: [{ sku: 'NET-SW-24P', qty: 1 }]
    }
  },
  {
    eventId: 'evt-ord-8903-01',
    eventName: 'OrderPlaced',
    topic: 'order.events',
    producerService: 'Order Service',
    consumerService: 'Inventory Service',
    partition: 0,
    offset: 89408,
    status: 'PROCESSED',
    timestamp: '2026-10-16 16:40:05',
    correlationId: 'corr-8903-fa9102',
    payload: {
      orderId: 'ORD-2026-8903',
      customerId: 'CUST-CLOUD-90',
      totalAmount: 699.00,
      items: [{ productId: 'PROD-103', quantity: 1, unitPrice: 699.00 }]
    }
  }
];

export const INITIAL_MICROSERVICES: Microservice[] = [
  {
    id: 'ms-gateway',
    name: 'API Gateway',
    port: 8080,
    version: 'v3.2.1-RELEASE',
    status: 'HEALTHY',
    responseTimeMs: 14,
    requestCount: 384920,
    errorRatePercent: 0.02,
    uptimePercent: 99.98,
    lastHealthCheck: 'Just now',
    description: 'Spring Cloud Gateway with JWT authentication, rate limiting, and SSL termination.',
    dependencies: ['User Service', 'Order Service', 'Inventory Service'],
    type: 'SERVICE'
  },
  {
    id: 'ms-order',
    name: 'Order Service',
    port: 8082,
    version: 'v2.8.0',
    status: 'HEALTHY',
    responseTimeMs: 28,
    requestCount: 142100,
    errorRatePercent: 0.04,
    uptimePercent: 99.95,
    lastHealthCheck: 'Just now',
    description: 'Manages order lifecycles and coordinates Saga state with Apache Kafka event streams.',
    dependencies: ['Kafka Broker', 'MySQL Database'],
    type: 'SERVICE'
  },
  {
    id: 'ms-inventory',
    name: 'Inventory Service',
    port: 8083,
    version: 'v2.5.4',
    status: 'HEALTHY',
    responseTimeMs: 22,
    requestCount: 198300,
    errorRatePercent: 0.01,
    uptimePercent: 99.99,
    lastHealthCheck: 'Just now',
    description: 'Real-time SKU reservation, stock replenishment, and multi-warehouse allocation.',
    dependencies: ['Kafka Broker', 'MySQL Database'],
    type: 'SERVICE'
  },
  {
    id: 'ms-payment',
    name: 'Payment Service',
    port: 8084,
    version: 'v3.0.1',
    status: 'HEALTHY',
    responseTimeMs: 65,
    requestCount: 88410,
    errorRatePercent: 0.85,
    uptimePercent: 99.91,
    lastHealthCheck: 'Just now',
    description: 'Idempotent payment orchestration supporting credit card gateways, POs, and ACH transfers.',
    dependencies: ['Kafka Broker', 'MySQL Database'],
    type: 'SERVICE'
  },
  {
    id: 'ms-notification',
    name: 'Notification Service',
    port: 8085,
    version: 'v1.9.2',
    status: 'HEALTHY',
    responseTimeMs: 18,
    requestCount: 112000,
    errorRatePercent: 0.01,
    uptimePercent: 99.99,
    lastHealthCheck: 'Just now',
    description: 'Dispatches real-time transactional emails, SMS webhooks, and push notifications.',
    dependencies: ['Kafka Broker', 'MongoDB'],
    type: 'SERVICE'
  },
  {
    id: 'ms-user',
    name: 'User Service',
    port: 8081,
    version: 'v2.1.0',
    status: 'HEALTHY',
    responseTimeMs: 19,
    requestCount: 204500,
    errorRatePercent: 0.02,
    uptimePercent: 99.97,
    lastHealthCheck: 'Just now',
    description: 'User profile management, enterprise tenant scopes, and RBAC authorization.',
    dependencies: ['MySQL Database'],
    type: 'SERVICE'
  },
  {
    id: 'ms-kafka',
    name: 'Kafka Broker Cluster',
    port: 9092,
    version: '3.6.1 (KRaft Mode)',
    status: 'HEALTHY',
    responseTimeMs: 4,
    requestCount: 1845000,
    errorRatePercent: 0.00,
    uptimePercent: 100.0,
    lastHealthCheck: 'Just now',
    description: 'High-throughput distributed event broker handling topics, partition replication, and consumer groups.',
    dependencies: [],
    type: 'BROKER'
  },
  {
    id: 'ms-mysql',
    name: 'MySQL Relational DB',
    port: 3306,
    version: '8.0.35-InnoDB',
    status: 'HEALTHY',
    responseTimeMs: 12,
    requestCount: 650000,
    errorRatePercent: 0.01,
    uptimePercent: 99.99,
    lastHealthCheck: 'Just now',
    description: 'ACID-compliant relational store for Orders, Payments, Customers, and SKU catalogs.',
    dependencies: [],
    type: 'DATABASE'
  },
  {
    id: 'ms-mongo',
    name: 'MongoDB NoSQL Store',
    port: 27017,
    version: '7.0.4 ReplicaSet',
    status: 'HEALTHY',
    responseTimeMs: 8,
    requestCount: 820000,
    errorRatePercent: 0.01,
    uptimePercent: 99.99,
    lastHealthCheck: 'Just now',
    description: 'Document store for system event logs, telemetry traces, and notification audit histories.',
    dependencies: [],
    type: 'DATABASE'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Order Confirmed: ORD-2026-8901',
    message: 'Sarah Jenkins has confirmed order ORD-2026-8901 for $2,099.93. Fulfillment queue notified.',
    type: 'ORDER',
    read: false,
    timestamp: '2026-10-16 18:32:14',
    relatedEntityId: 'ORD-2026-8901'
  },
  {
    id: 'notif-2',
    title: 'Payment Received: $2,099.93',
    message: 'Corporate PO authorization completed successfully for ORD-2026-8901.',
    type: 'PAYMENT',
    read: false,
    timestamp: '2026-10-16 18:32:13',
    relatedEntityId: 'PAY-40891'
  },
  {
    id: 'notif-3',
    title: 'Low Stock Alert: NET-SW-24P',
    message: 'Ubiquiti UniFi Pro 24-Port PoE Switch is down to 6 units (Threshold: 8). Automatic replenishment recommended.',
    type: 'INVENTORY',
    read: false,
    timestamp: '2026-10-16 16:40:06',
    relatedEntityId: 'PROD-103'
  },
  {
    id: 'notif-4',
    title: 'Payment Authorization Failed',
    message: 'Payment for order ORD-2026-8903 failed due to insufficient funds. Customer notified.',
    type: 'ALERT',
    read: true,
    timestamp: '2026-10-16 16:40:08',
    relatedEntityId: 'ORD-2026-8903'
  },
  {
    id: 'notif-5',
    title: 'Kafka Consumer Group Rebalanced',
    message: 'Consumer group "payment-processors" rebalanced across partitions 0, 1, 2 in 42ms.',
    type: 'SYSTEM',
    read: true,
    timestamp: '2026-10-16 15:00:00'
  },
  {
    id: 'notif-6',
    title: 'Out of Stock Alert: Axis P3268-LVE',
    message: 'Product SEC-CAM-4K reached 0 units available. SKU marked inactive for checkout.',
    type: 'INVENTORY',
    read: true,
    timestamp: '2026-10-16 11:20:00',
    relatedEntityId: 'PROD-106'
  }
];

export const INITIAL_SYSTEM_LOGS: SystemLog[] = [
  {
    id: 'log-101',
    timestamp: '2026-10-16 18:32:14.281',
    level: 'INFO',
    serviceName: 'Notification Service',
    message: 'Customer dispatch completed for order ORD-2026-8901 via SMTP worker pool.',
    correlationId: 'corr-8901-7fa1e9',
    metadata: { orderId: 'ORD-2026-8901', latencyMs: 142 }
  },
  {
    id: 'log-102',
    timestamp: '2026-10-16 18:32:14.110',
    level: 'INFO',
    serviceName: 'Order Service',
    message: 'Consumed PaymentCompleted event from payment.events [Partition: 1, Offset: 54109]. Order status -> CONFIRMED.',
    correlationId: 'corr-8901-7fa1e9'
  },
  {
    id: 'log-103',
    timestamp: '2026-10-16 18:32:13.489',
    level: 'INFO',
    serviceName: 'Payment Service',
    message: 'Published PaymentCompleted event to payment.events for transaction TXN-CPO-9021884 ($2,099.93).',
    correlationId: 'corr-8901-7fa1e9'
  },
  {
    id: 'log-104',
    timestamp: '2026-10-16 18:32:11.902',
    level: 'INFO',
    serviceName: 'Inventory Service',
    message: 'Reserved stock for order ORD-2026-8901: 2x PROD-101, 1x PROD-108. Published InventoryReserved event.',
    correlationId: 'corr-8901-7fa1e9'
  },
  {
    id: 'log-105',
    timestamp: '2026-10-16 18:32:10.024',
    level: 'INFO',
    serviceName: 'Order Service',
    message: 'Received POST /api/v1/orders. Created order ORD-2026-8901. Emitted OrderPlaced to order.events.',
    correlationId: 'corr-8901-7fa1e9'
  },
  {
    id: 'log-106',
    timestamp: '2026-10-16 16:40:08.774',
    level: 'ERROR',
    serviceName: 'Payment Service',
    message: 'Payment gateway rejected charge for order ORD-2026-8903. Reason: card_declined_insufficient_funds.',
    correlationId: 'corr-8903-fa9102',
    metadata: { httpStatus: 402, retryCount: 1 }
  },
  {
    id: 'log-107',
    timestamp: '2026-10-16 16:40:08.820',
    level: 'WARN',
    serviceName: 'Order Service',
    message: 'Order ORD-2026-8903 flagged for payment retry. Inventory reservation hold expiration set to 30 minutes.',
    correlationId: 'corr-8903-fa9102'
  },
  {
    id: 'log-108',
    timestamp: '2026-10-16 15:30:00.120',
    level: 'DEBUG',
    serviceName: 'API Gateway',
    message: 'JWT token validated for tenant AcmeCorp. Route: /api/v1/orders -> order-service:8082.',
    correlationId: 'corr-sys-auth-01'
  },
  {
    id: 'log-109',
    timestamp: '2026-10-16 14:10:05.450',
    level: 'INFO',
    serviceName: 'Kafka Broker',
    message: 'Leader election completed for partition order.events-0 on broker node-01.',
    correlationId: 'corr-broker-k8s-99'
  }
];
