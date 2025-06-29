import { products } from '@/lib/products';
import { HomeClient } from '@/components/HomeClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const seasonalSpecials = products.filter(p => p.isSeasonal);

  return (
    <div className="flex flex-col gap-16 md:gap-20 lg:gap-24 pb-12">
      <section className="text-center pt-20 pb-12 bg-card border-b">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight">
            Naturally Beautiful
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our exquisite collection of fresh flowers and lush plants, curated for every moment that matters.
          </p>
          <Button asChild size="lg" className="mt-8 font-bold">
            <Link href="#catalog">Shop All</Link>
          </Button>
        </div>
      </section>

      {seasonalSpecials.length > 0 && (
        <section className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-8 text-center">Seasonal Specials</h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {seasonalSpecials.map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden group h-full flex flex-col">
                      <CardHeader className="p-0 relative">
                        <Badge className="absolute top-3 right-3 z-10">Seasonal</Badge>
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={600}
                          height={400}
                          className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint={product.aiHint}
                        />
                      </CardHeader>
                      <CardContent className="p-4 flex flex-col flex-grow">
                        <CardTitle className="font-headline text-xl">{product.name}</CardTitle>
                        <CardDescription className="mt-2 text-base text-primary font-semibold">${product.price.toFixed(2)}</CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </section>
      )}

      <HomeClient allProducts={products} />
    </div>
  );
}
