export interface TransactionCreatedEvent {
  transaction_id: number;
  account_id: number;
  amount: number;
  category_id: number;
  type: string;
  timestamp: string;
}
