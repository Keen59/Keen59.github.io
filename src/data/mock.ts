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

export interface OverweightRow {
  id: string
  date: string
  shipPierId: string
  guide: string
  carrier: string
  shippingType: string
  declaredDims: string
  declaredWeight: string
  declaredVol: string
  actualDims: string
  actualWeight: string
  actualVol: string
}

export const USER = {
  name: 'Sercan Durukan',
  initials: 'S',
  balance: '$ 106,306.89',
}

export const KPI_STATS: KpiStat[] = [
  { id: '1', label: 'Labels Created', value: '778', icon: 'truck' },
  { id: '2', label: 'Total Spend', value: '$302,901.00', icon: 'dollar' },
  { id: '3', label: 'Average Cost', value: '$389.33', icon: 'scale' },
  { id: '4', label: 'Average Weight', value: '17.86 kg', icon: 'weight' },
  { id: '5', label: 'Delivered', value: '338', icon: 'check' },
  { id: '6', label: 'In Transit', value: '181', icon: 'route' },
]

export const CARRIER_USAGE: CarrierUsage[] = [
  { id: '1', name: 'Estafeta', shipments: 312, spend: '$98,420.00' },
  { id: '2', name: 'FedEx', shipments: 198, spend: '$76,210.00' },
  { id: '3', name: 'DHL', shipments: 145, spend: '$64,880.00' },
  { id: '4', name: 'UPS', shipments: 123, spend: '$63,391.00' },
]

export const DELIVERY_AVG: DeliveryAvg[] = [
  { id: '1', carrier: 'ShipPier Express', days: 1.5, speed: 'Fast' },
  { id: '2', carrier: 'DHL', days: 2.1, speed: 'Fast' },
  { id: '3', carrier: 'Estafeta', days: 3.4, speed: 'Normal' },
  { id: '4', carrier: 'FedEx', days: 2.8, speed: 'Normal' },
]

export const RECENT_SHIPMENTS: Shipment[] = [
  {
    id: '88201',
    tracking: 'TKR8820193847',
    registeredAt: '2026-07-16 14:22',
    recipient: 'Maria Lopez',
    address: 'Av. Reforma 222, CDMX',
    ecommerce: 'Shopify',
    carrier: 'Estafeta',
    status: 'documented',
    progress: 25,
  },
  {
    id: '88200',
    tracking: 'TKR8820084721',
    registeredAt: '2026-07-16 13:05',
    recipient: 'James Carter',
    address: '1200 Market St, SF, CA',
    ecommerce: 'Amazon',
    carrier: 'FedEx',
    status: 'in_transit',
    progress: 60,
  },
  {
    id: '88199',
    tracking: 'TKR8819976543',
    registeredAt: '2026-07-16 11:48',
    recipient: 'Ana Ruiz',
    address: 'Calle 8 #45, Guadalajara',
    ecommerce: 'WooCommerce',
    carrier: 'DHL',
    status: 'delivered',
    progress: 100,
  },
  {
    id: '88198',
    tracking: 'TKR8819811223',
    registeredAt: '2026-07-15 19:30',
    recipient: 'Omar Hassan',
    address: '45 King Rd, Dubai',
    ecommerce: 'Shopify',
    carrier: 'UPS',
    status: 'exception',
    progress: 40,
  },
  {
    id: '88197',
    tracking: 'TKR8819755099',
    registeredAt: '2026-07-15 16:12',
    recipient: 'Emily Chen',
    address: '88 Orchard Rd, Singapore',
    ecommerce: 'Amazon',
    carrier: 'DHL',
    status: 'in_transit',
    progress: 75,
  },
  {
    id: '88196',
    tracking: 'TKR8819633441',
    registeredAt: '2026-07-15 09:01',
    recipient: 'Carlos Mendez',
    address: 'Insurgentes Sur 1602, CDMX',
    ecommerce: 'Shopify',
    carrier: 'Estafeta',
    status: 'pending',
    progress: 10,
  },
  {
    id: '88195',
    tracking: 'TKR8819522780',
    registeredAt: '2026-07-14 22:44',
    recipient: 'Sophie Martin',
    address: '12 Rue de Rivoli, Paris',
    ecommerce: 'Etsy',
    carrier: 'FedEx',
    status: 'delivered',
    progress: 100,
  },
  {
    id: '88194',
    tracking: 'TKR8819411002',
    registeredAt: '2026-07-14 18:20',
    recipient: 'Lucas Silva',
    address: 'Av. Paulista 1000, SP',
    ecommerce: 'Shopify',
    carrier: 'UPS',
    status: 'documented',
    progress: 20,
  },
]

export const TICKETS: Ticket[] = [
  {
    id: '8198',
    status: 'waiting',
    statusLabel: 'Waiting for your response',
    subStatus: 'Pending',
    date: '2026-07-16 17:12',
    relative: '4h ago',
    classification: 'Label stopped / No movement',
    shipmentId: '88200',
  },
  {
    id: '8195',
    status: 'resolved',
    statusLabel: 'Your ticket has been resolved',
    subStatus: 'Finalized',
    date: '2026-07-16 12:40',
    relative: '8h ago',
    classification: 'Return to origin',
    shipmentId: '88198',
  },
  {
    id: '8188',
    status: 'in_progress',
    statusLabel: 'Under review',
    subStatus: 'Active',
    date: '2026-07-15 20:05',
    relative: '1d ago',
    classification: 'Delivery not recognized',
    shipmentId: '88194',
  },
  {
    id: '8172',
    status: 'closed',
    statusLabel: 'Ticket closed',
    subStatus: 'Closed',
    date: '2026-07-14 09:30',
    relative: '2d ago',
    classification: 'Address correction',
    shipmentId: '88190',
  },
]

export const OVERWEIGHT_ROWS: OverweightRow[] = [
  {
    id: '1',
    date: '2026-07-15',
    shipPierId: 'SP-45021',
    guide: 'ESTA784512369',
    carrier: 'Estafeta',
    shippingType: 'Ground',
    declaredDims: '50 x 37 x 18',
    declaredWeight: '4.20',
    declaredVol: '5.55',
    actualDims: '52 x 38 x 20',
    actualWeight: '5.10',
    actualVol: '6.58',
  },
  {
    id: '2',
    date: '2026-07-14',
    shipPierId: 'SP-45018',
    guide: 'FDX998877665',
    carrier: 'FedEx',
    shippingType: 'Express',
    declaredDims: '40 x 30 x 20',
    declaredWeight: '3.00',
    declaredVol: '4.00',
    actualDims: '41 x 31 x 22',
    actualWeight: '3.80',
    actualVol: '4.65',
  },
  {
    id: '3',
    date: '2026-07-13',
    shipPierId: 'SP-44990',
    guide: 'DHL112233445',
    carrier: 'DHL',
    shippingType: 'Ground',
    declaredDims: '60 x 40 x 25',
    declaredWeight: '8.00',
    declaredVol: '10.00',
    actualDims: '60 x 42 x 26',
    actualWeight: '9.20',
    actualVol: '10.92',
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
