export type ShipmentStage = 'first_transport' | 'warehouse' | 'second_transport'

export type ShipmentStatus =
  | 'documented'
  | 'in_transit'
  | 'delivered'
  | 'exception'
  | 'pending'

export type TicketStatus = 'waiting' | 'in_progress' | 'resolved' | 'closed'

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

export interface Ticket {
  id: string
  status: TicketStatus
  statusLabel: string
  subStatus: string
  date: string
  relative: string
  classification: string
  shipmentId: string
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
  { id: '1', carrier: 'ShipPier Express', days: 1.2, speed: 'Fast' },
  { id: '2', carrier: 'DHL', days: 2.6, speed: 'Fast' },
  { id: '3', carrier: 'UPS', days: 3.1, speed: 'Normal' },
  { id: '4', carrier: 'FedEx', days: 4.0, speed: 'Slow' },
]

export const RECENT_SHIPMENTS: Shipment[] = [
  {
    id: '70482',
    tracking: 'SPR7048219384',
    registeredAt: '2026-07-16 18:41',
    recipient: 'Leyla Demir',
    address: 'Bağdat Cad. 148, Istanbul',
    ecommerce: 'Shopify',
    carrier: 'DHL',
    status: 'in_transit',
    progress: 55,
    stage: 'first_transport',
    origin: 'Guangzhou, CN',
    warehouse: 'Istanbul Hub',
  },
  {
    id: '70471',
    tracking: 'SPR7047199201',
    registeredAt: '2026-07-16 15:17',
    recipient: 'Noah Keller',
    address: 'Friedrichstr. 90, Berlin',
    ecommerce: 'Amazon',
    carrier: 'UPS',
    status: 'documented',
    progress: 15,
    stage: 'first_transport',
    origin: 'Shenzhen, CN',
    warehouse: 'Berlin Hub',
  },
  {
    id: '70409',
    tracking: 'SPR7040955338',
    registeredAt: '2026-07-15 08:12',
    recipient: 'Mateo Rojas',
    address: 'Calle 72 #10, Bogota',
    ecommerce: 'Shopify',
    carrier: 'Estafeta',
    status: 'pending',
    progress: 8,
    stage: 'first_transport',
    origin: 'Yiwu, CN',
    warehouse: 'Miami Hub',
  },
  {
    id: '70438',
    tracking: 'SPR7043877442',
    registeredAt: '2026-07-15 21:56',
    recipient: 'Hiro Tanaka',
    address: 'Shibuya 2-1, Tokyo',
    ecommerce: 'Shopify',
    carrier: 'DHL',
    status: 'exception',
    progress: 35,
    stage: 'warehouse',
    origin: 'Ningbo, CN',
    warehouse: 'Tokyo Hub',
  },
  {
    id: '70374',
    tracking: 'SPR7037488115',
    registeredAt: '2026-07-14 10:09',
    recipient: 'Arjun Mehta',
    address: 'Bandra West, Mumbai',
    ecommerce: 'Shopify',
    carrier: 'DHL',
    status: 'documented',
    progress: 22,
    stage: 'warehouse',
    origin: 'Guangzhou, CN',
    warehouse: 'Dubai Hub',
  },
  {
    id: '70490',
    tracking: 'SPR7049088122',
    registeredAt: '2026-07-16 09:30',
    recipient: 'Sofia Alvarez',
    address: 'Gran Via 22, Madrid',
    ecommerce: 'WooCommerce',
    carrier: 'UPS',
    status: 'pending',
    progress: 40,
    stage: 'warehouse',
    origin: 'Shanghai, CN',
    warehouse: 'Madrid Hub',
  },
  {
    id: '70455',
    tracking: 'SPR7045548120',
    registeredAt: '2026-07-16 11:03',
    recipient: 'Amina Farouk',
    address: 'Zamalek St 12, Cairo',
    ecommerce: 'WooCommerce',
    carrier: 'FedEx',
    status: 'delivered',
    progress: 100,
    stage: 'second_transport',
    origin: 'Guangzhou, CN',
    warehouse: 'Cairo Hub',
  },
  {
    id: '70422',
    tracking: 'SPR7042266011',
    registeredAt: '2026-07-15 14:28',
    recipient: 'Elena Popov',
    address: 'Nevsky 45, St. Petersburg',
    ecommerce: 'Etsy',
    carrier: 'UPS',
    status: 'in_transit',
    progress: 70,
    stage: 'second_transport',
    origin: 'Shenzhen, CN',
    warehouse: 'Istanbul Hub',
  },
  {
    id: '70391',
    tracking: 'SPR7039144207',
    registeredAt: '2026-07-14 19:45',
    recipient: 'Chloe Martin',
    address: 'Rue Lafayette 8, Lyon',
    ecommerce: 'Amazon',
    carrier: 'FedEx',
    status: 'delivered',
    progress: 100,
    stage: 'second_transport',
    origin: 'Yiwu, CN',
    warehouse: 'Paris Hub',
  },
]

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
  },
]

export const TICKET_STATS = {
  total: 164,
  tracking: 23,
  closed: 141,
  average: 7,
}

export const BALANCE_STATS = [
  { label: 'Available Balance', value: '$ 64,812.47' },
  { label: 'Total Recharged', value: '$ 291,540.00' },
  { label: 'This Month', value: '$ 21,680.00' },
  { label: 'Average', value: '$ 7,890.00' },
  { label: 'Last Recharge', value: '$ 3,500.00' },
  { label: 'Applied Today', value: '$ 850.00' },
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
