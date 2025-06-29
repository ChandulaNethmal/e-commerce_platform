"use client";

import Image from "next/image";
import type { Product } from "@/lib/types";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/hooks";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="h-full flex flex-col overflow-hidden group transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="p-0 border-b">
        <div className="aspect-[4/3] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={400}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            data-ai-hint={product.aiHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-xl leading-tight">{product.name}</CardTitle>
        <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="font-semibold text-lg text-primary">${product.price.toFixed(2)}</p>
        <Button size="sm" onClick={() => addToCart(product, 1)}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
