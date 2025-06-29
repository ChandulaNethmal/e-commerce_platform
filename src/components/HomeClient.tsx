"use client";

import { useState, useMemo } from 'react';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatePresence, motion } from 'framer-motion';

type Filter = 'All' | 'Flowers' | 'Plants';

export function HomeClient({ allProducts }: { allProducts: Product[] }) {
  const [categoryFilter, setCategoryFilter] = useState<Filter>('All');
  const [occasionFilter, setOccasionFilter] = useState('All');
  const [colorFilter, setColorFilter] = useState('All');

  const occasions = useMemo(() => ['All', ...Array.from(new Set(allProducts.map(p => p.occasion)))], [allProducts]);
  const colors = useMemo(() => ['All', ...Array.from(new Set(allProducts.map(p => p.color)))], [allProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const categoryMatch = categoryFilter === 'All' || product.category === categoryFilter;
      const occasionMatch = occasionFilter === 'All' || product.occasion === occasionFilter;
      const colorMatch = colorFilter === 'All' || product.color === colorFilter;
      return categoryMatch && occasionMatch && colorMatch;
    });
  }, [allProducts, categoryFilter, occasionFilter, colorFilter]);

  return (
    <section id="catalog" className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">Our Collection</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">Browse our curated selection of beautiful flowers and healthy plants.</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-card rounded-lg border sticky top-16 z-40">
        <Tabs value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as Filter)}>
          <TabsList>
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Flowers">Flowers</TabsTrigger>
            <TabsTrigger value="Plants">Plants</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select value={occasionFilter} onValueChange={setOccasionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Occasion" />
            </SelectTrigger>
            <SelectContent>
              {occasions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={colorFilter} onValueChange={setColorFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Color" />
            </SelectTrigger>
            <SelectContent>
              {colors.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredProducts.length === 0 && (
         <div className="text-center py-16 col-span-full">
            <p className="text-muted-foreground">No products match your current filters.</p>
         </div>
      )}
    </section>
  );
}
