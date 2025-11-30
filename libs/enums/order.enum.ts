export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESS = 'PROCESS',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CARD = 'CARD',
  TRANSFER = 'TRANSFER',
  KAKAOPAY = 'KAKAOPAY',
  CASH = 'CASH',
}
