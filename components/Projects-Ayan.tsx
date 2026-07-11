"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  longDescription?: string;
  highlights?: string[];
  gallery?: string[];
  sampleCode?: string;
}

interface ProjectCategory {
  id: string;
  label: string;
  projects: Project[];
}

const SLIDE_VARIANTS = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function Projects() {
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalView, setModalView] = useState<"overview" | "code">("overview");

  // Lock body scroll when modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prev || "";
    }
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [selectedProject]);

  const projectCategories: ProjectCategory[] = [
    {
      id: "cafe",
      label: "Cafe Website",
      projects: [
        {
          title: "Modern Cafe Website",
          description:
            "A beautiful and responsive cafe website featuring menu displays, online ordering, reservation system, and gallery showcasing the cafe's ambiance and offerings.",
          technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
          image: "/Cozy Coffee Shop_ Delicious Brews Await!.jpeg",
          longDescription:
            "A premium cafe experience site that layers hero storytelling, top categories, and product spotlights with rich imagery. Built to convert: clear CTAs, category scrollers, social proof, and a footer with quick links. Fully responsive with tasteful gradients and depth to mirror the in-store ambiance.",
          highlights: [
            "Hero section with aroma-focused imagery and immediate Shop Now CTA.",
            "Carousel style top categories and milkshake grids with like counters.",
            "Detailed footer with product, category, and support navigation plus social links.",
          ],
          gallery: [
            "/Cozy Coffee Shop_ Delicious Brews Await!.jpeg",
          ],
          sampleCode: `// pseudo Next.js cafe landing
import Hero from "@/components/Hero";
import MenuGrid from "@/components/MenuGrid";
import Testimonials from "@/components/Testimonials";

export default function Page() {
  const drinks = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    name: \`Signature Roast #\${i + 1}\`,
    price: (4.5 + i * 0.2).toFixed(2),
    tags: [i % 2 ? "iced" : "hot", i % 3 ? "single-origin" : "blend"],
  }));

  return (
    <main className="bg-espresso text-cream min-h-screen">
      <Hero headline="Freshly Roasted Coffee" cta="Order Now" />
      <MenuGrid items={drinks} onSelect={(drink) => console.log(drink)} />
      <section className="grid gap-10 lg:grid-cols-2 px-8 py-16">
        <article className="rounded-3xl bg-[#0f172a]/80 p-8 border border-amber-200/20">
          <h2 className="text-2xl font-bold">Brew Specs</h2>
          <pre className="mt-4 text-xs whitespace-pre-wrap opacity-80">{JSON.stringify({
            water: "92C", grind: "medium-fine", ratio: "1:15", bloom: "45s",
          }, null, 2)}</pre>
        </article>
        <Testimonials />
      </section>
    </main>
  );
}
`,
        },
        {
          title: "Coffee Shop E-Commerce",
          description:
            "Full-featured coffee shop website with product catalog, subscription service, loyalty program, and seamless checkout for coffee enthusiasts.",
          technologies: ["React", "Next.js", "Stripe", "MongoDB"],
          image: "/Specialty Coffee - Elegant Café Landing Page Design.jpeg",
          gallery: ["/Specialty Coffee - Elegant Café Landing Page Design.jpeg"],
          sampleCode: `// simplified API handler
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.json();
  const { cart, customer } = body;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: customer.email,
    line_items: cart.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    })),
    success_url: "https://coffee.shop/success",
    cancel_url: "https://coffee.shop/cancel",
  });

  await db.collection("orders").insertOne({ cart, customer, sessionId: session.id });
  return Response.json({ url: session.url });
}
`,
        },
        {
          title: "Artisan Bakery & Cafe",
          description:
            "Elegant bakery website with daily specials, custom cake ordering, event catering services, and interactive menu with dietary filters.",
          technologies: ["Next.js", "TypeScript", "Sanity CMS", "Tailwind CSS"],
          image: "/Coffee UI site.jpeg",
          gallery: ["/Coffee UI site.jpeg"],
          sampleCode: `// mock CMS query
const query = \`*[_type == "pastry"]{title,price,allergens[],photo{asset->{url}}}\`;

export async function getPastries(client) {
  const items = await client.fetch(query);
  return items.map((item: any) => ({
    ...item,
    allergens: (item.allergens || []).join(", "),
  }));
}

export function DietaryFilter({ list }) {
  const [tag, setTag] = useState("all");
  const filtered = list.filter((item) => tag === "all" || item.allergens.includes(tag));
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["all", "vegan", "nuts", "gluten-free"].map((t) => (
          <button key={t} onClick={() => setTag(t)}>{t}</button>
        ))}
      </div>
      <ul>
        {filtered.map((item) => (
          <li key={item.title}>{item.title} — \${item.price}</li>
        ))}
      </ul>
    </div>
  );
}
`,
        },
      ],
    },
    {
      id: "real-estate",
      label: "Real Estate Website",
      projects: [
        {
          title: "Real Estate Platform",
          description:
            "Comprehensive real estate website with property listings, advanced search filters, virtual tours, agent profiles, and mortgage calculator for seamless property browsing and transactions.",
          technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
          image: "/Real Estate Landing Page Replication - Rukayat Yaro.jpeg",
          gallery: ["/Real Estate Landing Page Replication - Rukayat Yaro.jpeg"],
          sampleCode: `// map + filters + SSR stub
import Listings from "@/components/Listings";
import Filters from "@/components/Filters";

export default async function Page() {
  const listings = await fetch("https://api.example.com/properties?city=lagos").then((r) => r.json());
  return (
    <main className="min-h-screen bg-neutral-950 text-slate-50">
      <Filters />
      <Listings data={listings.slice(0, 24)} />
    </main>
  );
}
`,
        },
        {
          title: "Luxury Property Showcase",
          description:
            "Premium real estate website featuring high-end property galleries, 360° virtual tours, neighborhood insights, and exclusive listing access for luxury buyers.",
          technologies: ["Next.js", "Three.js", "TypeScript", "Tailwind CSS"],
          image: "/Urban elegance real estate flyer templates _ Premium Vector.jpeg",
          gallery: ["/Urban elegance real estate flyer templates _ Premium Vector.jpeg"],
          sampleCode: `// mock 3D gallery config
const heroTour = {
  id: "villa-aurora",
  pano: "/360/villa-aurora/index.json",
  hotspots: [
    { label: "Pool", target: "pool" },
    { label: "Living", target: "living" },
  ],
};

export function TourCTA() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-xl font-semibold">360° Immersive Tour</h3>
      <pre className="mt-4 text-xs whitespace-pre-wrap opacity-80">{JSON.stringify(heroTour, null, 2)}</pre>
      <button className="mt-4 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white">Launch Tour</button>
    </div>
  );
}
`,
        },
        {
          title: "Property Management Portal",
          description:
            "Complete property management solution with tenant portal, maintenance requests, payment processing, and analytics dashboard for property owners.",
          technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
          image: "/Build Your Dream Home in 2025_ Real Estate Landing Page.jpeg",
          gallery: ["/Build Your Dream Home in 2025_ Real Estate Landing Page.jpeg"],
          sampleCode: `// pseudo maintenance API route
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const payload = await req.json();
  const ticket = await db.collection("maintenance").insertOne({
    ...payload,
    status: "open",
    createdAt: new Date(),
  });
  return Response.json({ id: ticket.insertedId });
}

export async function GET() {
  const open = await db.collection("maintenance").find({ status: "open" }).limit(50).toArray();
  return Response.json(open);
}
`,
        },
      ],
    },
    {
      id: "ecommerce",
      label: "Ecommerce Seller Website",
      projects: [
        {
          title: "Ecommerce Seller Platform",
          description:
            "Full-featured ecommerce platform for sellers with product management, inventory tracking, order processing, analytics dashboard, and customer management system.",
          technologies: ["Next.js", "TypeScript", "Stripe", "MongoDB", "Tailwind CSS"],
          image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Multi-Vendor Marketplace",
          description:
            "Advanced marketplace platform supporting multiple vendors with individual storefronts, commission management, and integrated payment processing.",
          technologies: ["Next.js", "TypeScript", "PostgreSQL", "Stripe Connect"],
          image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Dropshipping Dashboard",
          description:
            "Comprehensive dropshipping platform with supplier integration, automated order fulfillment, profit tracking, and marketing tools for online sellers.",
          technologies: ["React", "Node.js", "MongoDB", "Shopify API"],
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
        },
      ],
    },
    {
      id: "salon",
      label: "Salons Website",
      projects: [
        {
          title: "Salon Booking Website",
          description:
            "Elegant salon website with service listings, online appointment booking, staff profiles, portfolio gallery, and customer reviews to enhance the salon experience.",
          technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
          image: "https://images.unsplash.com/photo-1560066984-138dadb4e035?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Beauty Spa Platform",
          description:
            "Luxury spa website with treatment packages, gift card system, membership plans, and wellness blog for a complete beauty experience.",
          technologies: ["Next.js", "TypeScript", "Sanity CMS", "Stripe"],
          image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Hair Salon Management",
          description:
            "Complete salon management system with client database, appointment scheduling, service pricing, staff management, and revenue analytics.",
          technologies: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
          image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
        },
      ],
    },
    {
      id: "gym",
      label: "Gym Website",
      projects: [
        {
          title: "Fitness Center Website",
          description:
            "Dynamic gym website featuring membership plans, class schedules, trainer profiles, workout programs, nutrition guides, and progress tracking tools.",
          technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
          image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "CrossFit Training Platform",
          description:
            "High-energy CrossFit website with WOD schedules, member leaderboards, nutrition plans, and community features for fitness enthusiasts.",
          technologies: ["React", "Next.js", "MongoDB", "Tailwind CSS"],
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Yoga Studio Website",
          description:
            "Peaceful yoga studio platform with class booking, instructor profiles, meditation guides, and online streaming for remote sessions.",
          technologies: ["Next.js", "TypeScript", "Vimeo API", "Tailwind CSS"],
          image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80",
        },
      ],
    },
    {
      id: "boutique",
      label: "Boutique Website",
      projects: [
        {
          title: "Fashion Boutique Website",
          description:
            "Stylish boutique website showcasing fashion collections, lookbook galleries, size guides, wishlist functionality, and seamless checkout experience for fashion enthusiasts.",
          technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Luxury Fashion E-Commerce",
          description:
            "Premium fashion boutique with curated collections, personal styling services, size recommendations, and exclusive member access.",
          technologies: ["Next.js", "TypeScript", "Stripe", "Sanity CMS"],
          image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Vintage Clothing Store",
          description:
            "Unique vintage boutique platform with curated collections, authentication certificates, rarity indicators, and collector community features.",
          technologies: ["React", "Next.js", "MongoDB", "Tailwind CSS"],
          image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
        },
      ],
    },
    {
      id: "social-media",
      label: "Social Media",
      projects: [
        {
          title: "Social Media Platform",
          description:
            "Modern social media platform with user profiles, feed system, real-time messaging, content sharing, likes and comments, and notification system for engaging social interactions.",
          technologies: ["Next.js", "TypeScript", "Socket.io", "MongoDB", "Tailwind CSS"],
          image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Professional Networking App",
          description:
            "LinkedIn-style professional network with job postings, skill endorsements, industry groups, and career development resources.",
          technologies: ["React", "Next.js", "PostgreSQL", "Redis"],
          image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Photo Sharing Community",
          description:
            "Instagram-inspired platform with photo filters, stories, reels, hashtag discovery, and creator monetization features.",
          technologies: ["Next.js", "TypeScript", "AWS S3", "MongoDB"],
          image: "https://images.unsplash.com/photo-1611262588024-d58030d9b75f?auto=format&fit=crop&w=900&q=80",
        },
      ],
    },
    {
      id: "education",
      label: "Educational Institute Website",
      projects: [
        {
          title: "Educational Platform",
          description:
            "Comprehensive educational institute website with course listings, student portal, faculty profiles, event calendar, admission forms, and online learning resources.",
          technologies: ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS"],
          image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Online Learning Management System",
          description:
            "Complete LMS with video courses, quizzes, assignments, progress tracking, certificates, and interactive discussion forums.",
          technologies: ["React", "Next.js", "PostgreSQL", "Vimeo API"],
          image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "University Portal",
          description:
            "Full university website with department pages, research publications, faculty directory, campus map, and student services portal.",
          technologies: ["Next.js", "TypeScript", "Sanity CMS", "Tailwind CSS"],
          image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80",
        },
      ],
    },
    {
      id: "event-planner",
      label: "Event Planner Website",
      projects: [
        {
          title: "Event Planning Platform",
          description:
            "Professional event planning website with event packages, portfolio showcase, client testimonials, booking system, and detailed event planning services for memorable occasions.",
          technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
          image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Wedding Planning Suite",
          description:
            "Specialized wedding planning platform with vendor directory, budget calculator, timeline management, and RSVP tracking system.",
          technologies: ["Next.js", "TypeScript", "MongoDB", "Stripe"],
          image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Corporate Events Manager",
          description:
            "Enterprise event management system with attendee registration, badge printing, session scheduling, and networking features.",
          technologies: ["React", "Node.js", "PostgreSQL", "Tailwind CSS"],
          image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80",
        },
      ],
    },
    {
      id: "cloud-kitchen",
      label: "Cloud Kitchen Website",
      projects: [
        {
          title: "Cloud Kitchen Platform",
          description:
            "Efficient cloud kitchen website with menu management, order tracking, delivery integration, kitchen dashboard, and real-time order status updates for seamless food delivery operations.",
          technologies: ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS", "Socket.io"],
          image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Multi-Brand Kitchen Hub",
          description:
            "Advanced cloud kitchen supporting multiple restaurant brands with separate menus, branding, and order management from a single kitchen facility.",
          technologies: ["React", "Next.js", "PostgreSQL", "Socket.io"],
          image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Food Delivery Dashboard",
          description:
            "Complete delivery management system with driver tracking, route optimization, customer notifications, and analytics for cloud kitchen operations.",
          technologies: ["Next.js", "TypeScript", "MongoDB", "Google Maps API"],
          image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80",
        },
      ],
    },
    {
      id: "hospital",
      label: "Hospital Website",
      projects: [
        {
          title: "Hospital Management System",
          description:
            "Comprehensive hospital website with doctor profiles, appointment booking, department information, emergency services, and patient portal for seamless healthcare access.",
          technologies: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
          image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Medical Clinic Platform",
          description:
            "Modern clinic website with online consultations, prescription management, lab reports access, health records, and telemedicine integration.",
          technologies: ["React", "Next.js", "WebRTC", "MongoDB"],
          image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Healthcare Appointment System",
          description:
            "Advanced appointment management system with real-time availability, automated reminders, waitlist management, and multi-department scheduling.",
          technologies: ["Next.js", "TypeScript", "PostgreSQL", "Socket.io"],
          image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=80",
        },
      ],
    },
  ];

  const activeProjects = projectCategories[activeTab]?.projects || [];

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    if (newDirection === 1) {
      setActiveTab((prev) => (prev + 1) % projectCategories.length);
    } else {
      setActiveTab((prev) => (prev - 1 + projectCategories.length) % projectCategories.length);
    }
  }, [projectCategories.length]);

  const handleTabChange = useCallback((index: number) => {
    const newDirection = index > activeTab ? 1 : -1;
    setDirection(newDirection);
    setActiveTab(index);
  }, [activeTab]);

  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipe = swipePower(info.offset.x, info.velocity.x);
    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  }, [paginate]);

  const handleProjectClick = useCallback(
    (project: Project, view: "overview" | "code" = "overview") => {
      if (isDragging) return;
      setSelectedProject(project);
      setModalView(view);
    },
    [isDragging],
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        paginate(-1);
      } else if (e.key === "ArrowRight") {
        paginate(1);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [paginate]);

  return (
    <section
      id="projects"
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-950"
    >
      {/* Top gradient blend from previous section */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-slate-950 via-slate-950/80 to-transparent z-0" />
      {/* Bottom gradient blend to next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent z-0" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.h2
          className="font-display text-4xl sm:text-5xl font-bold text-center mb-4 text-slate-50"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Featured Projects
        </motion.h2>
        <motion.div
          className="w-24 h-1 bg-linear-to-r from-blue-500 to-purple-500 mx-auto mb-12"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        ></motion.div>

        {/* Tab Navigation with Sliding Indicator */}
        <div className="mb-12 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="relative flex gap-2 sm:gap-3 min-w-max pb-2">
            {projectCategories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => handleTabChange(index)}
                className={`relative px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-medium text-sm sm:text-base whitespace-nowrap transition-colors duration-300 z-10 ${
                  activeTab === index
                    ? "text-white"
                    : "text-slate-300 hover:text-slate-100 bg-slate-800/50 border border-slate-700/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.label}
              </motion.button>
            ))}
            {/* Sliding Background Indicator */}
            <motion.div
              className="absolute bottom-2 left-0 h-[calc(100%-1rem)] bg-linear-to-r from-sky-500 to-purple-500 rounded-xl shadow-lg shadow-sky-500/50 z-0"
              layoutId="activeTab"
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 30,
              }}
            />
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-center gap-4 mb-8">
          <motion.button
            onClick={() => paginate(-1)}
            className="p-3 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous category"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <div className="flex items-center gap-2">
            {projectCategories.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => handleTabChange(index)}
                className={`h-2 rounded-full transition-all ${
                  activeTab === index ? "w-8 bg-sky-500" : "w-2 bg-slate-600"
                }`}
                whileHover={{ scale: 1.2 }}
                aria-label={`Go to ${projectCategories[index].label}`}
              />
            ))}
          </div>
          <motion.button
            onClick={() => paginate(1)}
            className="p-3 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next category"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* Projects Grid with Advanced Slide Animation */}
        <div className="relative overflow-hidden" ref={containerRef}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={activeTab}
              custom={direction}
              variants={SLIDE_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={(e, info) => {
                setIsDragging(false);
                handleDragEnd(e, info);
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {activeProjects.map((project, index) => (
                <motion.div
                  key={`${activeTab}-${index}`}
                  className="group overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 shadow-[0_20px_80px_rgba(15,23,42,0.95)] transition-all duration-500 hover:-translate-y-3 hover:border-sky-500/60 hover:shadow-[0_30px_120px_rgba(8,47,73,1)]"
                  initial={{ opacity: 0, y: 60, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  whileHover={{ scale: 1.02, zIndex: 10 }}
                  style={{ cursor: isDragging ? "grabbing" : "grab" }}
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="relative h-52 w-full overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      quality={85}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80" />
                  </div>
                  <div className="flex flex-col gap-4 p-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-slate-50">
                        {project.title}
                      </h3>
                      <p className="text-slate-300 leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <motion.span
                          key={techIndex}
                          className="rounded-full bg-slate-800/80 px-3 py-1 text-sm text-sky-300"
                          whileHover={{ scale: 1.1 }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-4 text-sm font-semibold">
                      <motion.button
                        className="text-sky-400 hover:text-sky-300 hover:underline transition-colors"
                        whileHover={{ x: 5 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProjectClick(project, "overview");
                        }}
                      >
                        View case study →
                      </motion.button>
                      <motion.button
                        className="text-slate-400 hover:text-slate-300 hover:underline transition-colors"
                        whileHover={{ x: 5 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProjectClick(project, "code");
                        }}
                      >
                        View code
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-[0_40px_160px_rgba(8,47,73,0.8)] backdrop-blur-xl"
                initial={{ y: 40, scale: 0.98, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: 40, scale: 0.98, opacity: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute right-4 top-4 rounded-full bg-slate-800/80 p-2 text-slate-300 transition hover:bg-slate-700 hover:text-white"
                  aria-label="Close project details"
                >
                  ✕
                </button>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-slate-50">{selectedProject.title}</h3>
                  <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 p-1">
                    <button
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        modalView === "overview" ? "bg-slate-800 text-white" : "text-slate-300"
                      }`}
                      onClick={() => setModalView("overview")}
                    >
                      Overview
                    </button>
                    <button
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        modalView === "code" ? "bg-slate-800 text-white" : "text-slate-300"
                      }`}
                      onClick={() => setModalView("code")}
                    >
                      Code dump
                    </button>
                  </div>
                </div>
                {modalView === "overview" ? (
                  <div className="grid max-h-[90vh] gap-6 overflow-y-auto pr-2 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="space-y-4">
                      <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
                        <Image
                          src={selectedProject.gallery?.[0] ?? selectedProject.image}
                          alt={selectedProject.title}
                          fill
                          sizes="(min-width: 1024px) 60vw, 90vw"
                          className="object-contain"
                          priority
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          Featured Cafe Concept
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-3xl font-bold text-slate-50">{selectedProject.title}</h3>
                        <p className="text-slate-200 leading-relaxed">
                          {selectedProject.longDescription ?? selectedProject.description}
                        </p>
                        {selectedProject.highlights && (
                          <ul className="grid gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-slate-200">
                            {selectedProject.highlights.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        {(selectedProject.gallery ?? [selectedProject.image]).map((img, idx) => (
                          <div
                            key={idx}
                            className="relative h-28 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition hover:-translate-y-1 hover:border-sky-500/60"
                          >
                            <Image
                              src={img}
                              alt={`${selectedProject.title} view ${idx + 1}`}
                              fill
                              sizes="150px"
                              className="object-contain bg-slate-950"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                        <h4 className="mb-3 text-sm font-semibold text-slate-200">Stack & tools</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-sky-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          className="rounded-xl bg-linear-to-r from-sky-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:brightness-110"
                          onClick={() => setSelectedProject(null)}
                        >
                          Close
                        </button>
                        <button className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-500 hover:text-white">
                          Download case study
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="max-h-[80vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <p className="mb-3 text-sm text-slate-300">
                      Demo project code (synthetic mix of real/fake snippets) just to showcase depth:
                    </p>
                    <pre className="whitespace-pre-wrap text-xs leading-relaxed text-slate-100 font-mono">
                      {selectedProject.sampleCode ??
                        `// fallback demo
import React from "react";

export function Demo() {
  const queue = [];
  for (let i = 0; i < 50; i++) {
    queue.push({ id: i, title: "Mock line " + i, active: i % 3 === 0 });
  }
  return (
    <section>
      {queue.map((row) => (
        <article key={row.id}>
          <header>{row.title}</header>
          <p>active: {String(row.active)}</p>
        </article>
      ))}
    </section>
  );
}
`}
                    </pre>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        className="rounded-xl bg-linear-to-r from-sky-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:brightness-110"
                        onClick={() => setSelectedProject(null)}
                      >
                        Close
                      </button>
                      <button
                        className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-500 hover:text-white"
                        onClick={() => setModalView("overview")}
                      >
                        Back to overview
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}


