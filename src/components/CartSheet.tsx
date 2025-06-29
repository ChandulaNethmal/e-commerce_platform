"use client";

import { useCart } from "@/lib/hooks";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "./ui/sheet";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { Minus, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";

export function CartSheet({ children }: { children: React.ReactNode }) {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, itemCount } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-headline text-2xl">Your Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-grow pr-4 -mr-6">
              <div className="flex flex-col gap-4 py-4">
                {cartItems.map(item => (
                  <div key={item.product.id} className="flex items-center gap-4">
                    <Image src={item.product.image} alt={item.product.name} width={80} height={80} className="rounded-md object-cover" data-ai-hint={item.product.aiHint} />
                    <div className="flex-grow">
                      <p className="font-semibold">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.product.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <SheetFooter>
              <div className="w-full mt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <SheetClose asChild>
                  <Button asChild className="w-full mt-4">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <p className="text-xl font-semibold">Your cart is empty</p>
            <p className="text-muted-foreground mt-2">Find something beautiful to fill it.</p>
            <SheetClose asChild>
              <Button asChild className="mt-4">
                <Link href="/#catalog">Start Shopping</Link>
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
