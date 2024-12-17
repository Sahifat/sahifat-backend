export interface Borrow {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned';
}
