export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Flowers' | 'Plants';
  occasion: 'Anniversary' | 'Birthday' | 'Congratulations' | 'Sympathy' | 'Thank You' | 'Seasonal';
  color: 'Red' | 'Yellow' | 'Pink' | 'White' | 'Orange' | 'Purple' | 'Green' | 'Mixed';
  isSeasonal?: boolean;
  aiHint?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
