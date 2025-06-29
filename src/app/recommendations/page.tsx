"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { recommendFlowers, type FlowerRecommendationInput, type FlowerRecommendationOutput } from "@/ai/flows/flower-recommendation";
import { Loader2, Wand2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const FormSchema = z.object({
  occasion: z.string().min(3, { message: "Occasion must be at least 3 characters." }),
  recipient: z.string().min(2, { message: "Recipient must be at least 2 characters." }),
  browsingHistory: z.string().optional(),
});

export default function RecommendationsPage() {
  const [recommendation, setRecommendation] = useState<FlowerRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      occasion: "",
      recipient: "",
      browsingHistory: "",
    },
  });

  const onSubmit: SubmitHandler<FlowerRecommendationInput> = async (data) => {
    setIsLoading(true);
    setError(null);
    setRecommendation(null);
    try {
      const result = await recommendFlowers(data);
      setRecommendation(result);
    } catch (e: any) {
      setError("Sorry, we couldn't generate a recommendation at this time. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit mb-4">
              <Wand2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl">AI Floral Assistant</CardTitle>
            <CardDescription>
              Let our AI help you find the perfect arrangement. Tell us a bit about what you're looking for.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="occasion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occasion</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Anniversary, Birthday..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recipient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mom, Best Friend, Partner..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="browsingHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferences (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., loves tulips, prefers pink" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  Get Recommendation
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {error && (
            <Alert variant="destructive" className="mt-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {recommendation && (
          <Card className="mt-8 animate-in fade-in-50 duration-500">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Your Personal Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-lg">{recommendation.recommendation}</h3>
              {recommendation.reasoning && <p className="text-muted-foreground mt-2">{recommendation.reasoning}</p>}
            </CardContent>
            <CardFooter>
                 <Button asChild className="w-full">
                    <a href="/#catalog">Shop Now</a>
                 </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
