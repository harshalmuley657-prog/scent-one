/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Header } from './components/common/Header';
import { Hero } from './components/hero/Hero';
import { CinematicSlider } from './components/slider/CinematicSlider';
import { ProductGrid } from './components/collection/ProductGrid';
import { FragranceStory } from './components/story/FragranceStory';
import { WhySolidPerfume } from './components/solid/WhySolidPerfume';
import { HowToUse } from './components/solid/HowToUse';
import { FragranceQuiz } from './components/quiz/FragranceQuiz';
import { BrandStory } from './components/brand/BrandStory';
import { CustomerReviews } from './components/reviews/CustomerReviews';
import { InstagramGallery } from './components/social/InstagramGallery';
import { FAQSection } from './components/faq/FAQSection';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderSuccessModal } from './components/checkout/OrderSuccessModal';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { SearchModal } from './components/search/SearchModal';
import { WishlistDrawer } from './components/wishlist/WishlistDrawer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PolicyModal } from './components/policies/PolicyModal';
import { ToastContainer } from './components/common/Toast';

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col font-sans selection:bg-[#D8B66B]/30 selection:text-white">
        {/* 1. Announcement Strip */}
        <AnnouncementBar />

        {/* 2. Premium Navigation Bar */}
        <Header />

        <main className="flex-1">
          {/* 3. Cinematic Hero */}
          <Hero />

          {/* 4. Featured Perfume Carousel / Cinematic Slider */}
          <CinematicSlider />

          {/* 5 & 6. Discover Collection & Men / Women / Unisex Categories */}
          <ProductGrid />

          {/* 7. Fragrance Storytelling & The Four Universes */}
          <FragranceStory />

          {/* 8. Why Choose Solid Perfume */}
          <WhySolidPerfume />

          {/* 9. How to Use */}
          <HowToUse />

          {/* 10. Fragrance Finder Quiz */}
          <FragranceQuiz />

          {/* 11. Brand Story & Founder Yash Jain */}
          <BrandStory />

          {/* 12. Clearly Identified Demo Customer Reviews */}
          <CustomerReviews />

          {/* 13. Instagram Gallery (@scent_one_) */}
          <InstagramGallery />

          {/* 14. FAQ Section */}
          <FAQSection />
        </main>

        {/* 15. Premium Footer */}
        <Footer />

        {/* Global Modals & Interactive Drawers */}
        <CartDrawer />
        <CheckoutModal />
        <OrderSuccessModal />
        <ProductDetailModal />
        <SearchModal />
        <WishlistDrawer />
        <AdminDashboard />
        <PolicyModal />
        <ToastContainer />
      </div>
    </StoreProvider>
  );
}
