export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  categoryId: string;
  description?: string;
  publishedYear?: number;
  imageUrl?: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
