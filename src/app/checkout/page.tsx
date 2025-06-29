"use client";

import { useFormState, useFormStatus } from "react-dom";
import { placeOrder } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending || disabled}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Place Order
    </Button>
  );
}

export default function CheckoutPage() {
  const [state, formAction] = useFormState(placeOrder, null);
  const { toast } = useToast();
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (cartItems.length === 0) {
        toast({ title: "Your cart is empty", description: "Please add items to your cart before checking out." });
        router.push('/');
    }
  }, [cartItems, router, toast]);

  useEffect(() => {
    if (state?.success) {
      toast({ title: "Order Successful!", description: "Thank you for your purchase. A confirmation has been 'sent'." });
      clearCart();
      router.push("/");
    } else if (state?.error) {
      const errorMessages = Object.values(state.error).flat().join(", ");
      toast({ variant: "destructive", title: "Order Failed", description: errorMessages });
    }
  }, [state, toast, clearCart, router]);

  if (cartItems.length === 0) {
    return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Checkout</CardTitle>
              <CardDescription>Please fill in your details to complete the purchase.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-4">
                <h3 className="font-semibold text-lg">Shipping Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" required />
                        {state?.error?.name && <p className="text-sm text-destructive">{state.error.name.join(', ')}</p>}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                        {state?.error?.email && <p className="text-sm text-destructive">{state.error.email.join(', ')}</p>}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="address" required />
                        {state?.error?.address && <p className="text-sm text-destructive">{state.error.address.join(', ')}</p>}
                    </div>
                </div>

                <Separator className="my-6" />

                <h3 className="font-semibold text-lg">Payment Details (Mock)</h3>
                 <div className="space-y-2">
                    <Label htmlFor="card">Card Number</Label>
                    <Input id="card" name="card" placeholder="0000 0000 0000 0000" required />
                    {state?.error?.card && <p className="text-sm text-destructive">{state.error.card.join(', ')}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                        <Input id="expiry" name="expiry" placeholder="MM/YY" required />
                        {state?.error?.expiry && <p className="text-sm text-destructive">{state.error.expiry.join(', ')}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" name="cvc" placeholder="123" required />
                        {state?.error?.cvc && <p className="text-sm text-destructive">{state.error.cvc.join(', ')}</p>}
                    </div>
                </div>
                <SubmitButton disabled={cartItems.length === 0} />
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="order-first lg:order-last">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {cartItems.map(item => (
                            <div key={item.product.id} className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <Image src={item.product.image} alt={item.product.name} width={64} height={64} className="rounded-md object-cover" />
                                    <div>
                                        <p className="font-semibold">{item.product.name}</p>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <p>Total</p>
                            <p>${cartTotal.toFixed(2)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
