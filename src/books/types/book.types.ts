export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  categoryId: string;
  quantity: number;
  available: boolean;
  description?: string;
  publishedYear?: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
