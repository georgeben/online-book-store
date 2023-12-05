export interface CreateOrderItem {
  bookId: number;
  quantity: number;
  unitPrice: number;
  orderId: number;
}

export interface CreateOrder {
  customerId: number;
  items: {
    bookId: number;
    quantity: number;
    unitPrice: number;
  }[];
}
