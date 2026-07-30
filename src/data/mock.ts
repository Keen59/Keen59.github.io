export type ShipmentStage = 'first_transport' | 'warehouse' | 'second_transport'

export type ShipmentStatus =
  | 'documented'
  | 'in_transit'
  | 'delivered'
  | 'exception'
  | 'pending'

export type TicketStatus = 'waiting' | 'in_progress' | 'resolved' | 'closed'

export type Platform = 'Amazon' | 'Etsy' | 'Shopify' | 'eBay' | 'WooCommerce'

export interface KpiStat {
  id: string
  label: string
  value: string
  icon: 'truck' | 'dollar' | 'scale' | 'weight' | 'check' | 'route'
}

export interface CarrierUsage {
  id: string
  name: string
  shipments: number
  spend: string
}

export interface DeliveryAvg {
  id: string
  carrier: string
  days: number
  speed: 'Fast' | 'Normal' | 'Slow'
}

export interface OrderStageEvent {
  id: string
  stage: ShipmentStage
  title: string
  detail: string
  at: string
  location: string
  done: boolean
}

export interface Order {
  id: string
  orderNo: string
  boxId: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
  }
  platform: Platform
  storeName: string
  registeredAt: string
  carrier: string
  status: ShipmentStatus
  progress: number
  stage: ShipmentStage
  origin: string
  warehouse: string
  tracking: string
  timeline: OrderStageEvent[]
}

/** @deprecated use Order — kept for dashboard recent list mapping */
export interface Shipment {
  id: string
  tracking: string
  registeredAt: string
  recipient: string
  address: string
  ecommerce: string
  carrier: string
  status: ShipmentStatus
  progress: number
  stage: ShipmentStage
  origin?: string
  warehouse?: string
}

export interface TicketMessage {
  id: string
  from: 'support' | 'customer'
  author: string
  at: string
  text: string
  attachment?: {
    name: string
    type: 'image' | 'file'
  }
}

export interface Ticket {
  id: string
  status: TicketStatus
  statusLabel: string
  subStatus: string
  date: string
  relative: string
  classification: string
  shipmentId: string
  tracking: string
  carrier: string
  customer: {
    name: string
    company: string
    email: string
    phone: string
  }
  messages: TicketMessage[]
}

export type WalletAccountId =
  | 'labels'
  | 'cargo'
  | 'warehouse'
  | 'returns'
  | 'general'

export interface WalletAccount {
  id: WalletAccountId
  name: string
  description: string
  balance: string
  spentMonth: string
  toppedUpMonth: string
  lastCharge: string
  currency: string
}

export interface Transaction {
  id: string
  date: string
  wallet: WalletAccountId
  type: 'top_up' | 'charge' | 'refund' | 'transfer'
  description: string
  amount: string
  balanceAfter: string
}

export interface Employee {
  id: string
  name: string
  role: string
  email: string
  status: 'active' | 'away' | 'offline'
  ordersHandled: number
}

export interface LabelRow {
  id: string
  labelNo: string
  orderNo: string
  boxId: string
  carrier: string
  createdAt: string
  status: 'ready' | 'printed' | 'void'
}

export const SHIPMENT_STAGES: {
  id: ShipmentStage
  step: number
  label: string
  short: string
  description: string
}[] = [
  {
    id: 'first_transport',
    step: 1,
    label: '1st Transport',
    short: '1. Transport',
    description: 'Supplier → Warehouse',
  },
  {
    id: 'warehouse',
    step: 2,
    label: 'Warehouse',
    short: 'Warehouse',
    description: 'Receiving & processing',
  },
  {
    id: 'second_transport',
    step: 3,
    label: '2nd Transport',
    short: '2. Transport',
    description: 'Warehouse → Customer',
  },
]

export const USER = {
  name: 'Kaan Bayraktar',
  initials: 'KB',
  balance: '$ 64,812.47',
  balanceShort: '$65k',
}

export const KPI_STATS: KpiStat[] = [
  { id: '1', label: 'Labels Created', value: '1,246', icon: 'truck' },
  { id: '2', label: 'Total Spend', value: '$187,453.60', icon: 'dollar' },
  { id: '3', label: 'Average Cost', value: '$150.44', icon: 'scale' },
  { id: '4', label: 'Average Weight', value: '9.37 kg', icon: 'weight' },
  { id: '5', label: 'Delivered', value: '691', icon: 'check' },
  { id: '6', label: 'In Transit', value: '274', icon: 'route' },
]

export const CARRIER_USAGE: CarrierUsage[] = [
  { id: '1', name: 'DHL', shipments: 418, spend: '$61,902.15' },
  { id: '2', name: 'UPS', shipments: 356, spend: '$48,771.40' },
  { id: '3', name: 'FedEx', shipments: 289, spend: '$42,018.90' },
  { id: '4', name: 'Estafeta', shipments: 183, spend: '$34,761.15' },
]

export const DELIVERY_AVG: DeliveryAvg[] = [
  { id: '1', carrier: 'ESCArgo Express', days: 1.2, speed: 'Fast' },
  { id: '2', carrier: 'DHL', days: 2.6, speed: 'Fast' },
  { id: '3', carrier: 'UPS', days: 3.1, speed: 'Normal' },
  { id: '4', carrier: 'FedEx', days: 4.0, speed: 'Slow' },
]

function timeline(
  orderNo: string,
  current: ShipmentStage,
): OrderStageEvent[] {
  const steps: Omit<OrderStageEvent, 'done'>[] = [
    {
      id: `${orderNo}-1a`,
      stage: 'first_transport',
      title: 'Picked up from supplier',
      detail: 'Package collected and first-mile scan completed',
      at: '2026-07-12 09:14',
      location: 'Guangzhou, CN',
    },
    {
      id: `${orderNo}-1b`,
      stage: 'first_transport',
      title: 'In transit to hub',
      detail: 'Air / ground transfer to destination warehouse',
      at: '2026-07-13 16:40',
      location: 'In transit',
    },
    {
      id: `${orderNo}-2a`,
      stage: 'warehouse',
      title: 'Arrived at warehouse',
      detail: 'Inbound dock received and box ID assigned',
      at: '2026-07-14 11:05',
      location: 'Regional Hub',
    },
    {
      id: `${orderNo}-2b`,
      stage: 'warehouse',
      title: 'Sorted & labeled',
      detail: 'QC check passed, outbound label printed',
      at: '2026-07-14 18:22',
      location: 'Regional Hub',
    },
    {
      id: `${orderNo}-3a`,
      stage: 'second_transport',
      title: 'Out for delivery',
      detail: 'Last-mile carrier departed warehouse',
      at: '2026-07-15 08:50',
      location: 'Last mile',
    },
    {
      id: `${orderNo}-3b`,
      stage: 'second_transport',
      title: 'Delivered / final scan',
      detail: 'Customer delivery confirmation',
      at: '2026-07-16 14:10',
      location: 'Destination',
    },
  ]

  const order: ShipmentStage[] = [
    'first_transport',
    'warehouse',
    'second_transport',
  ]
  const currentIdx = order.indexOf(current)

  return steps.map((s) => {
    const stageIdx = order.indexOf(s.stage)
    return {
      ...s,
      done: stageIdx < currentIdx || (stageIdx === currentIdx && s.id.endsWith('a')),
    }
  })
}

export const ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderNo: 'ESC-70482',
    boxId: 'BOX-9A2F41',
    customer: {
      name: 'Leyla Demir',
      email: 'leyla.demir@mail.com',
      phone: '+90 532 441 2290',
      address: 'Bağdat Cad. 148, Istanbul',
    },
    platform: 'Amazon',
    storeName: 'Nordic Home TR',
    registeredAt: '2026-07-16 18:41',
    carrier: 'DHL',
    status: 'in_transit',
    progress: 55,
    stage: 'first_transport',
    origin: 'Guangzhou, CN',
    warehouse: 'Istanbul Hub',
    tracking: 'ESC7048219384',
    timeline: timeline('ESC-70482', 'first_transport'),
  },
  {
    id: 'ord-2',
    orderNo: 'ESC-70471',
    boxId: 'BOX-3C81DE',
    customer: {
      name: 'Noah Keller',
      email: 'noah.keller@mail.com',
      phone: '+49 170 882 4411',
      address: 'Friedrichstr. 90, Berlin',
    },
    platform: 'Etsy',
    storeName: 'Berlin Craft Co',
    registeredAt: '2026-07-16 15:17',
    carrier: 'UPS',
    status: 'documented',
    progress: 15,
    stage: 'first_transport',
    origin: 'Shenzhen, CN',
    warehouse: 'Berlin Hub',
    tracking: 'ESC7047199201',
    timeline: timeline('ESC-70471', 'first_transport'),
  },
  {
    id: 'ord-3',
    orderNo: 'ESC-70409',
    boxId: 'BOX-77B0AA',
    customer: {
      name: 'Mateo Rojas',
      email: 'mateo.rojas@mail.com',
      phone: '+57 310 554 8821',
      address: 'Calle 72 #10, Bogota',
    },
    platform: 'Shopify',
    storeName: 'Andes Market',
    registeredAt: '2026-07-15 08:12',
    carrier: 'Estafeta',
    status: 'pending',
    progress: 8,
    stage: 'first_transport',
    origin: 'Yiwu, CN',
    warehouse: 'Miami Hub',
    tracking: 'ESC7040955338',
    timeline: timeline('ESC-70409', 'first_transport'),
  },
  {
    id: 'ord-4',
    orderNo: 'ESC-70438',
    boxId: 'BOX-11E9C2',
    customer: {
      name: 'Hiro Tanaka',
      email: 'hiro.tanaka@mail.com',
      phone: '+81 90 4412 7788',
      address: 'Shibuya 2-1, Tokyo',
    },
    platform: 'Amazon',
    storeName: 'Tokyo Gadgets',
    registeredAt: '2026-07-15 21:56',
    carrier: 'DHL',
    status: 'exception',
    progress: 35,
    stage: 'warehouse',
    origin: 'Ningbo, CN',
    warehouse: 'Tokyo Hub',
    tracking: 'ESC7043877442',
    timeline: timeline('ESC-70438', 'warehouse'),
  },
  {
    id: 'ord-5',
    orderNo: 'ESC-70374',
    boxId: 'BOX-55D401',
    customer: {
      name: 'Arjun Mehta',
      email: 'arjun.mehta@mail.com',
      phone: '+91 98200 44122',
      address: 'Bandra West, Mumbai',
    },
    platform: 'eBay',
    storeName: 'Mumbai Imports',
    registeredAt: '2026-07-14 10:09',
    carrier: 'DHL',
    status: 'documented',
    progress: 22,
    stage: 'warehouse',
    origin: 'Guangzhou, CN',
    warehouse: 'Dubai Hub',
    tracking: 'ESC7037488115',
    timeline: timeline('ESC-70374', 'warehouse'),
  },
  {
    id: 'ord-6',
    orderNo: 'ESC-70490',
    boxId: 'BOX-8F2201',
    customer: {
      name: 'Sofia Alvarez',
      email: 'sofia.alvarez@mail.com',
      phone: '+34 612 884 330',
      address: 'Gran Via 22, Madrid',
    },
    platform: 'Etsy',
    storeName: 'Iberia Studio',
    registeredAt: '2026-07-16 09:30',
    carrier: 'UPS',
    status: 'pending',
    progress: 40,
    stage: 'warehouse',
    origin: 'Shanghai, CN',
    warehouse: 'Madrid Hub',
    tracking: 'ESC7049088122',
    timeline: timeline('ESC-70490', 'warehouse'),
  },
  {
    id: 'ord-7',
    orderNo: 'ESC-70455',
    boxId: 'BOX-2A90FF',
    customer: {
      name: 'Amina Farouk',
      email: 'amina.farouk@mail.com',
      phone: '+20 100 554 2211',
      address: 'Zamalek St 12, Cairo',
    },
    platform: 'WooCommerce',
    storeName: 'Nile Boutique',
    registeredAt: '2026-07-16 11:03',
    carrier: 'FedEx',
    status: 'delivered',
    progress: 100,
    stage: 'second_transport',
    origin: 'Guangzhou, CN',
    warehouse: 'Cairo Hub',
    tracking: 'ESC7045548120',
    timeline: timeline('ESC-70455', 'second_transport').map((e) => ({
      ...e,
      done: true,
    })),
  },
  {
    id: 'ord-8',
    orderNo: 'ESC-70422',
    boxId: 'BOX-C44120',
    customer: {
      name: 'Elena Popov',
      email: 'elena.popov@mail.com',
      phone: '+7 921 441 0099',
      address: 'Nevsky 45, St. Petersburg',
    },
    platform: 'Shopify',
    storeName: 'Baltic Goods',
    registeredAt: '2026-07-15 14:28',
    carrier: 'UPS',
    status: 'in_transit',
    progress: 70,
    stage: 'second_transport',
    origin: 'Shenzhen, CN',
    warehouse: 'Istanbul Hub',
    tracking: 'ESC7042266011',
    timeline: timeline('ESC-70422', 'second_transport'),
  },
  {
    id: 'ord-9',
    orderNo: 'ESC-70391',
    boxId: 'BOX-0912AB',
    customer: {
      name: 'Chloe Martin',
      email: 'chloe.martin@mail.com',
      phone: '+33 6 12 88 44 01',
      address: 'Rue Lafayette 8, Lyon',
    },
    platform: 'Amazon',
    storeName: 'Lyon Maison',
    registeredAt: '2026-07-14 19:45',
    carrier: 'FedEx',
    status: 'delivered',
    progress: 100,
    stage: 'second_transport',
    origin: 'Yiwu, CN',
    warehouse: 'Paris Hub',
    tracking: 'ESC7039144207',
    timeline: timeline('ESC-70391', 'second_transport').map((e) => ({
      ...e,
      done: true,
    })),
  },
]

export const RECENT_SHIPMENTS: Shipment[] = ORDERS.map((o) => ({
  id: o.orderNo.replace('ESC-', ''),
  tracking: o.tracking,
  registeredAt: o.registeredAt,
  recipient: o.customer.name,
  address: o.customer.address,
  ecommerce: o.platform,
  carrier: o.carrier,
  status: o.status,
  progress: o.progress,
  stage: o.stage,
  origin: o.origin,
  warehouse: o.warehouse,
}))

export const TICKETS: Ticket[] = [
  {
    id: '6421',
    status: 'waiting',
    statusLabel: 'Waiting for your response',
    subStatus: 'Pending',
    date: '2026-07-16 19:04',
    relative: '2h ago',
    classification: 'Label stopped / No movement',
    shipmentId: '70482',
    tracking: 'ESC7048219384MX882019',
    carrier: 'DHL',
    customer: {
      name: 'Leyla Demir',
      company: 'Nordic Home TR',
      email: 'leyla.demir@mail.com',
      phone: '+90 532 441 2290',
    },
    messages: [
      {
        id: 'm1',
        from: 'support',
        author: 'ESCArgo Support',
        at: '16 Jul 2026 11:20 a.m.',
        text: 'Hello, we received your ticket about no movement on this label. We are checking with the carrier.',
      },
      {
        id: 'm2',
        from: 'customer',
        author: 'Leyla Demir',
        at: '16 Jul 2026 2:05 p.m.',
        text: 'Thanks. Can you also confirm if the package left the first hub?',
      },
      {
        id: 'm3',
        from: 'support',
        author: 'ESCArgo Support',
        at: '16 Jul 2026 4:40 p.m.',
        text: 'Here is the latest scan screenshot from the origin hub.',
        attachment: { name: 'hub-scan.png', type: 'image' },
      },
    ],
  },
  {
    id: '6398',
    status: 'resolved',
    statusLabel: 'Your ticket has been resolved',
    subStatus: 'Finalized',
    date: '2026-07-16 10:22',
    relative: '11h ago',
    classification: 'Return to origin',
    shipmentId: '70438',
    tracking: 'ESC7043877442JP1102',
    carrier: 'DHL',
    customer: {
      name: 'Hiro Tanaka',
      company: 'Tokyo Gadgets',
      email: 'hiro.tanaka@mail.com',
      phone: '+81 90 4412 7788',
    },
    messages: [
      {
        id: 'm1',
        from: 'support',
        author: 'ESCArgo Support',
        at: '15 Jul 2026 9:10 a.m.',
        text: 'Return to origin was confirmed. A refund has been issued to your balance.',
      },
      {
        id: 'm2',
        from: 'support',
        author: 'ESCArgo Support',
        at: '15 Jul 2026 9:12 a.m.',
        text: 'Screenshot of the refund',
        attachment: { name: 'refund-proof.jpg', type: 'image' },
      },
      {
        id: 'm3',
        from: 'customer',
        author: 'Hiro Tanaka',
        at: '15 Jul 2026 10:01 a.m.',
        text: 'Perfect, thank you. Closing this on my side.',
      },
    ],
  },
  {
    id: '6375',
    status: 'in_progress',
    statusLabel: 'Under review',
    subStatus: 'Active',
    date: '2026-07-15 16:48',
    relative: '1d ago',
    classification: 'Delivery not recognized',
    shipmentId: '70409',
    tracking: 'ESC7040955338CO441',
    carrier: 'Estafeta',
    customer: {
      name: 'Mateo Rojas',
      company: 'Andes Market',
      email: 'mateo.rojas@mail.com',
      phone: '+57 310 554 8821',
    },
    messages: [
      {
        id: 'm1',
        from: 'customer',
        author: 'Mateo Rojas',
        at: '15 Jul 2026 4:50 p.m.',
        text: 'The customer says they never received the package even though it shows delivered.',
      },
      {
        id: 'm2',
        from: 'support',
        author: 'ESCArgo Support',
        at: '15 Jul 2026 6:15 p.m.',
        text: 'We opened an investigation with the carrier. Please share a photo of the delivery door if available.',
      },
    ],
  },
  {
    id: '6310',
    status: 'closed',
    statusLabel: 'Ticket closed',
    subStatus: 'Closed',
    date: '2026-07-13 13:15',
    relative: '3d ago',
    classification: 'Address correction',
    shipmentId: '70374',
    tracking: 'ESC7037488115AE991',
    carrier: 'DHL',
    customer: {
      name: 'Arjun Mehta',
      company: 'Mumbai Imports',
      email: 'arjun.mehta@mail.com',
      phone: '+91 98200 44122',
    },
    messages: [
      {
        id: 'm1',
        from: 'customer',
        author: 'Arjun Mehta',
        at: '13 Jul 2026 10:02 a.m.',
        text: 'Please update the delivery address before last mile.',
        attachment: { name: 'new-address.pdf', type: 'file' },
      },
      {
        id: 'm2',
        from: 'support',
        author: 'ESCArgo Support',
        at: '13 Jul 2026 11:40 a.m.',
        text: 'Address updated successfully. Ticket closed.',
      },
    ],
  },
]

export const TICKET_STATS = {
  total: 164,
  tracking: 23,
  closed: 141,
  average: 7,
}

export const WALLET_ACCOUNTS: WalletAccount[] = [
  {
    id: 'labels',
    name: 'Label Fees',
    description: 'Outbound & print label charges only',
    balance: '$ 18,420.50',
    spentMonth: '$ 4,812.30',
    toppedUpMonth: '$ 6,000.00',
    lastCharge: '-$12.40 · ESC-70482',
    currency: 'USD',
  },
  {
    id: 'cargo',
    name: 'Cargo Fees',
    description: 'Carrier freight & shipping costs',
    balance: '$ 29,860.15',
    spentMonth: '$ 11,240.80',
    toppedUpMonth: '$ 15,000.00',
    lastCharge: '-$86.20 · DHL air ESC-70422',
    currency: 'USD',
  },
  {
    id: 'warehouse',
    name: 'Warehouse Fees',
    description: 'Receiving, sorting & handling',
    balance: '$ 7,140.00',
    spentMonth: '$ 1,980.40',
    toppedUpMonth: '$ 2,500.00',
    lastCharge: '-$4.20 · Hub handling',
    currency: 'USD',
  },
  {
    id: 'returns',
    name: 'Return Labels',
    description: 'Return label & reverse logistics',
    balance: '$ 3,215.82',
    spentMonth: '$ 640.10',
    toppedUpMonth: '$ 1,000.00',
    lastCharge: '-$9.10 · RTL-8891',
    currency: 'USD',
  },
  {
    id: 'general',
    name: 'General Wallet',
    description: 'Unallocated funds / transfers',
    balance: '$ 6,176.00',
    spentMonth: '$ 0.00',
    toppedUpMonth: '$ 3,500.00',
    lastCharge: '+$3,500.00 · Card top-up',
    currency: 'USD',
  },
]

export const BALANCE_STATS = [
  { label: 'Total Across Wallets', value: '$ 64,812.47' },
  { label: 'Label Fees Balance', value: '$ 18,420.50' },
  { label: 'Cargo Fees Balance', value: '$ 29,860.15' },
  { label: 'Warehouse Balance', value: '$ 7,140.00' },
  { label: 'Returns Balance', value: '$ 3,215.82' },
  { label: 'General Wallet', value: '$ 6,176.00' },
]

export const TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    date: '2026-07-16 17:20',
    wallet: 'labels',
    type: 'charge',
    description: 'Outbound label ESC-70482',
    amount: '-$12.40',
    balanceAfter: '$18,420.50',
  },
  {
    id: 'tx-2',
    date: '2026-07-16 16:05',
    wallet: 'cargo',
    type: 'charge',
    description: 'DHL air freight ESC-70422',
    amount: '-$86.20',
    balanceAfter: '$29,860.15',
  },
  {
    id: 'tx-3',
    date: '2026-07-16 09:05',
    wallet: 'general',
    type: 'top_up',
    description: 'Card top-up to general wallet',
    amount: '+$3,500.00',
    balanceAfter: '$6,176.00',
  },
  {
    id: 'tx-4',
    date: '2026-07-15 21:10',
    wallet: 'warehouse',
    type: 'charge',
    description: 'Warehouse handling fee',
    amount: '-$4.20',
    balanceAfter: '$7,140.00',
  },
  {
    id: 'tx-5',
    date: '2026-07-15 18:40',
    wallet: 'labels',
    type: 'charge',
    description: 'Outbound label ESC-70471',
    amount: '-$11.90',
    balanceAfter: '$18,432.90',
  },
  {
    id: 'tx-6',
    date: '2026-07-15 14:02',
    wallet: 'returns',
    type: 'refund',
    description: 'Voided return label refund RTL-8870',
    amount: '+$8.90',
    balanceAfter: '$3,215.82',
  },
  {
    id: 'tx-7',
    date: '2026-07-14 11:44',
    wallet: 'returns',
    type: 'charge',
    description: 'Return label RTL-8891',
    amount: '-$9.10',
    balanceAfter: '$3,206.92',
  },
  {
    id: 'tx-8',
    date: '2026-07-14 10:20',
    wallet: 'cargo',
    type: 'top_up',
    description: 'Dedicated cargo wallet top-up',
    amount: '+$5,000.00',
    balanceAfter: '$29,946.35',
  },
  {
    id: 'tx-9',
    date: '2026-07-13 16:12',
    wallet: 'general',
    type: 'transfer',
    description: 'Transfer general → labels',
    amount: '-$1,000.00',
    balanceAfter: '$2,676.00',
  },
  {
    id: 'tx-10',
    date: '2026-07-13 16:12',
    wallet: 'labels',
    type: 'transfer',
    description: 'Transfer from general wallet',
    amount: '+$1,000.00',
    balanceAfter: '$18,444.80',
  },
  {
    id: 'tx-11',
    date: '2026-07-12 09:30',
    wallet: 'warehouse',
    type: 'top_up',
    description: 'Warehouse wallet top-up',
    amount: '+$1,200.00',
    balanceAfter: '$7,144.20',
  },
  {
    id: 'tx-12',
    date: '2026-07-11 14:55',
    wallet: 'cargo',
    type: 'charge',
    description: 'UPS ground ESC-70391',
    amount: '-$42.75',
    balanceAfter: '$24,946.35',
  },
]

export const EMPLOYEES: Employee[] = [
  {
    id: 'e1',
    name: 'Elif Yılmaz',
    role: 'Warehouse Lead',
    email: 'elif@escargo.com',
    status: 'active',
    ordersHandled: 842,
  },
  {
    id: 'e2',
    name: 'Marcus Lee',
    role: 'Support Agent',
    email: 'marcus@escargo.com',
    status: 'active',
    ordersHandled: 511,
  },
  {
    id: 'e3',
    name: 'Nora Schmidt',
    role: 'Label Operator',
    email: 'nora@escargo.com',
    status: 'away',
    ordersHandled: 1260,
  },
  {
    id: 'e4',
    name: 'Omar Haddad',
    role: 'Returns Specialist',
    email: 'omar@escargo.com',
    status: 'offline',
    ordersHandled: 298,
  },
]

export const LABELS: LabelRow[] = [
  {
    id: 'l1',
    labelNo: 'LBL-22091',
    orderNo: 'ESC-70482',
    boxId: 'BOX-9A2F41',
    carrier: 'DHL',
    createdAt: '2026-07-16 18:50',
    status: 'printed',
  },
  {
    id: 'l2',
    labelNo: 'LBL-22088',
    orderNo: 'ESC-70471',
    boxId: 'BOX-3C81DE',
    carrier: 'UPS',
    createdAt: '2026-07-16 15:30',
    status: 'ready',
  },
  {
    id: 'l3',
    labelNo: 'LBL-22070',
    orderNo: 'ESC-70438',
    boxId: 'BOX-11E9C2',
    carrier: 'DHL',
    createdAt: '2026-07-15 22:10',
    status: 'void',
  },
]

export const RETURN_LABELS: LabelRow[] = [
  {
    id: 'r1',
    labelNo: 'RTL-8891',
    orderNo: 'ESC-70391',
    boxId: 'BOX-0912AB',
    carrier: 'FedEx',
    createdAt: '2026-07-16 10:12',
    status: 'printed',
  },
  {
    id: 'r2',
    labelNo: 'RTL-8874',
    orderNo: 'ESC-70438',
    boxId: 'BOX-11E9C2',
    carrier: 'DHL',
    createdAt: '2026-07-15 19:40',
    status: 'ready',
  },
]

export const SETTINGS_SHORTCUTS = [
  {
    id: '1',
    title: 'Manage Account',
    description: 'Suggested by your recent activity.',
    icon: 'account' as const,
  },
  {
    id: '2',
    title: 'Transactions',
    description: 'Suggested by your recent activity.',
    icon: 'wallet' as const,
  },
  {
    id: '3',
    title: 'Shipping Report',
    description: 'Suggested by your recent activity.',
    icon: 'report' as const,
  },
  {
    id: '4',
    title: 'Developer Tools',
    description: 'Suggested by your recent activity.',
    icon: 'code' as const,
  },
  {
    id: '5',
    title: 'Profile',
    description: 'Suggested by your recent activity.',
    icon: 'profile' as const,
  },
  {
    id: '6',
    title: 'My Shipping Services',
    description: 'Suggested by your recent activity.',
    icon: 'services' as const,
  },
  {
    id: '7',
    title: 'Recharge Balance',
    description: 'Add funds to continue operating.',
    icon: 'topup' as const,
  },
  {
    id: '8',
    title: 'Addresses',
    description: 'Manage senders and recipients.',
    icon: 'address' as const,
  },
]
