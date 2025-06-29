"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitContact } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Send Message
    </Button>
  );
}

export default function ContactPage() {
  const [state, formAction] = useFormState(submitContact, null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success) {
      toast({ title: "Message Sent!", description: "Thank you for reaching out. We'll get back to you soon." });
      (document.getElementById("contact-form") as HTMLFormElement)?.reset();
    } else if (state?.error) {
      const errorMessages = Object.values(state.error).flat().join(", ");
      toast({ variant: "destructive", title: "Submission Failed", description: errorMessages });
    }
  }, [state, toast]);

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Get in Touch</CardTitle>
          <CardDescription>
            Have a question or a special request? We&apos;d love to hear from you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="contact-form" action={formAction} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Your Name" required />
                {state?.error?.name && <p className="text-sm text-destructive">{state.error.name.join(', ')}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="your@email.com" required />
                 {state?.error?.email && <p className="text-sm text-destructive">{state.error.email.join(', ')}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" placeholder="Your message..." required rows={6} />
              {state?.error?.message && <p className="text-sm text-destructive">{state.error.message.join(', ')}</p>}
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
