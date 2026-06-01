"use client";

import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { Heart, Sparkles, Briefcase, ArrowRight, Play } from "lucide-react";

const Home = () => {
  const router = useRouter();
  const { activeRole, setActiveRole, isAuthenticated, creators } = useApp();

  // If user is authenticated, redirect to dashboard
  if (isAuthenticated && activeRole !== "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to InzoziMarket</h1>
          <p className="text-xl text-zinc-300 mb-8">Loading your dashboard...</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full font-semibold"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white text-black">
      {/* ===== HERO SECTION ===== */}
      <section className="relative h-screen min-h-96 bg-gradient-to-b from-gray-900 via-black to-black text-white flex flex-col items-center justify-center overflow-hidden">
        {/* Background image effect */}
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=60" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Where Creators <span className="text-gray-300">Thrive</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Build lasting community. Create what excites you. Turn your passion into sustainable income.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => {
                setActiveRole("creator");
                router.push("/sign-up");
              }}
              className="bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              Start Creating
            </button>
            <button
              onClick={() => {
                setActiveRole("fan");
                router.push("/explore-creators");
              }}
              className="border-2 border-white hover:bg-white hover:text-black px-8 py-4 rounded-full font-bold text-lg transition-all"
            >
              Discover Creators
            </button>
          </div>

          {/* Featured creator card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-xl mx-auto border border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&auto=format&fit=crop&q=60" 
                alt="Creator" 
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="text-left">
                <h3 className="font-bold text-lg">Kirenga Tech</h3>
                <p className="text-sm text-gray-300">12.5K Followers • Technology & AI</p>
              </div>
            </div>
            <p className="text-gray-300 italic">
              "InzoziMarket lets me focus on what I love — creating authentic tech content for my community."
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">Scroll to explore</p>
            <svg className="w-6 h-6 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* ===== CREATORS SHOWCASE ===== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Creativity Powered by Community
          </h2>
          <p className="text-center text-xl text-gray-600 max-w-3xl mx-auto mb-16">
            InzoziMarket is the best place to build community with your biggest fans, share exclusive work, and turn your passion into a lasting creative business.
          </p>

          {/* Creator grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {creators.slice(0, 4).map((creator) => (
              <div
                key={creator.id}
                onClick={() => router.push(`/explore-creators`)}
                className="group cursor-pointer"
              >
                <div className="relative mb-4 overflow-hidden rounded-2xl bg-gray-800 p-8 aspect-square flex items-center justify-center text-6xl transform group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={[
                      "https://images.unsplash.com/photo-1516321318423-f06f70259471?w=300&h=300&auto=format&fit=crop&q=60",
                      "https://images.unsplash.com/photo-1516534775068-bb57314e0fb1?w=300&h=300&auto=format&fit=crop&q=60",
                      "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=300&h=300&auto=format&fit=crop&q=60",
                      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&auto=format&fit=crop&q=60"
                    ][creators.indexOf(creator)]}
                    alt={creator.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-center group-hover:text-gray-700 transition-colors">
                  {creator.name}
                </h3>
                <p className="text-center text-sm text-gray-600">{creator.niche}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-gray-100 rounded-3xl p-12 text-center border border-gray-300">
            <p className="text-2xl md:text-3xl font-semibold mb-6 text-gray-900">
              "InzoziMarket provides a space for creators to sustain ourselves by connecting us directly to our own communities."
            </p>
            <div className="flex items-center justify-center gap-4">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&auto=format&fit=crop&q=60" 
                alt="Testimonial" 
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-left">
                <p className="font-bold">Jade Novah</p>
                <p className="text-sm text-gray-600">Music Creator • 18.1K Fans</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURE 1: Complete Control ===== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">Complete Creative Control</h2>
            <p className="text-xl text-gray-700 mb-4">
              InzoziMarket is your space to create what excites you most—rough or polished, big or small. Share videos, podcasts, writing, art, music, and more with your most passionate fans.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Set your own schedule, choose what to share, and decide how to monetize. No algorithms. No gatekeepers.
            </p>
            <button
              onClick={() => router.push("/sign-up")}
              className="bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2"
            >
              Create on Your Terms <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="relative h-96 bg-gray-200 rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1516321318423-f06f70259471?w=600&auto=format&fit=crop&q=60" 
              alt="Creative Control" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ===== FEATURE 2: Direct Community ===== */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 bg-gray-300 rounded-3xl overflow-hidden shadow-2xl order-2 md:order-1">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop&q=60" 
              alt="Community" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">Creators. Fans. Nothing in Between.</h2>
            <p className="text-xl text-gray-700 mb-4">
              Connect directly with your community through real-time chats, comments, direct messages, and more. Access your fans like nowhere else.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Build relationships. Answer questions. Get feedback. Grow together—all without ads, sponsors controlling your content, or algorithms getting in the way.
            </p>
            <button
              onClick={() => router.push("/explore-creators")}
              className="bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2"
            >
              Build Real Community <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ===== FEATURE 3: Multiple Income Streams ===== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-black">Turn Passion Into Business</h2>
          <p className="text-center text-xl text-gray-600 max-w-3xl mx-auto mb-16">
            InzoziMarket is the best place to build community with your biggest fans, share exclusive work, and turn your passion into a lasting creative business.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Card 1 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-300 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-2xl mb-6 text-white font-bold">
                M
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Memberships</h3>
              <p className="text-gray-700 mb-6">
                Create tiered membership levels. Fans subscribe for exclusive content, early access, and special perks.
              </p>
              <button className="text-black font-semibold hover:text-gray-600 flex items-center gap-2">
                Learn more <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-300 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-2xl mb-6 text-white font-bold">
                D
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Digital Shop</h3>
              <p className="text-gray-700 mb-6">
                Sell individual videos, podcasts, courses, or digital products. Your fans buy, you earn—instantly.
              </p>
              <button className="text-black font-semibold hover:text-gray-600 flex items-center gap-2">
                Learn more <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-300 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-2xl mb-6 text-white font-bold">
                C
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Brand Collabs</h3>
              <p className="text-gray-700 mb-6">
                Connect with businesses for sponsorships & collaborations. Negotiate terms directly with full transparency.
              </p>
              <button className="text-black font-semibold hover:text-gray-600 flex items-center gap-2">
                Learn more <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats section */}
          <div className="bg-black text-white rounded-3xl p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-5xl font-bold text-white mb-2">$5B+</p>
                <p className="text-xl text-gray-400">Earned by creators worldwide</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-white mb-2">500K+</p>
                <p className="text-xl text-gray-400">Active creators</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-white mb-2">50M+</p>
                <p className="text-xl text-gray-400">Registered fans</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-8">Your World to Create</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of creators building sustainable businesses and genuine communities. Start free today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setActiveRole("creator");
                router.push("/sign-up");
              }}
              className="bg-white text-black hover:bg-gray-200 px-10 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              Get Started
            </button>
            <button
              onClick={() => router.push("/sign-in")}
              className="border-2 border-white hover:bg-white/10 px-10 py-4 rounded-full font-bold text-lg transition-all"
            >
              Log In
            </button>
          </div>

          <p className="text-gray-400 mt-8">
            Starting a creator account is completely free. Upgrade to monetize when you're ready.
          </p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-black text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Column 1: Creators */}
            <div>
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Creators
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    For Podcasters
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    For Video Creators
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    For Musicians
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    For Artists
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Features */}
            <div>
              <h4 className="font-bold text-lg mb-6">Features</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Memberships
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Digital Shop
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Grow Community
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Analytics
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <h4 className="font-bold text-lg mb-6">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Creator Hub
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Updates
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Company */}
            <div>
              <h4 className="font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Newsroom
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Press Kit
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 5: Legal */}
            <div>
              <h4 className="font-bold text-lg mb-6">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom footer */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2026 InzoziMarket. All rights reserved.</p>
            <div className="flex gap-6 mt-6 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                Discord
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
