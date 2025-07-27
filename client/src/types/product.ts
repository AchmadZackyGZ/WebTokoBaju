export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: "Pria" | "Wanita" | "Anak";
  sizes: string[];
  stock: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
