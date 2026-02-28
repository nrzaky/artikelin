import article1 from "@/assets/article-1.jpg";
import article2 from "@/assets/article-2.jpg";
import article3 from "@/assets/article-3.jpg";
import article4 from "@/assets/article-4.jpg";
import article5 from "@/assets/article-5.jpg";
import article6 from "@/assets/article-6.jpg";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
}

export const articles: Article[] = [
  {
    id: "1",
    title: "The Future of Remote Work: How Teams Are Adapting",
    excerpt: "Explore how modern teams are reshaping the workplace with flexible remote strategies and innovative collaboration tools.",
    content: `<p>The landscape of work has changed dramatically over the past few years. Remote work, once considered a perk, has become a standard practice for millions of professionals worldwide.</p>

<h2>The Shift in Workplace Culture</h2>
<p>Companies large and small have had to adapt their cultures to accommodate distributed teams. This shift has brought both challenges and unexpected benefits.</p>
<p>Communication tools have evolved rapidly, with platforms like Slack, Teams, and Zoom becoming essential infrastructure. But beyond the tools, it's the human element that makes remote work successful.</p>

<h2>Building Trust Across Distances</h2>
<p>Trust is the foundation of any successful remote team. Managers have learned that measuring output rather than hours logged leads to better results and happier employees.</p>

<blockquote>The best remote teams aren't those with the best tools — they're the ones with the strongest cultures of trust and accountability.</blockquote>

<h2>Looking Forward</h2>
<p>As we move into the future, hybrid models are becoming the norm. The key is flexibility — allowing team members to work in the way that best suits their roles and lifestyles.</p>
<p>The organizations that thrive will be those that embrace change while maintaining the human connections that make work meaningful.</p>`,
    author: "Sarah Johnson",
    date: "Feb 24, 2026",
    category: "Technology",
    image: article1,
    readTime: "5 min read",
  },
  {
    id: "2",
    title: "Finding Peace: A Journey Through Mountain Trails",
    excerpt: "Discover the transformative power of hiking through some of the world's most breathtaking mountain landscapes.",
    content: `<p>There's something deeply restorative about walking through mountains. The air gets thinner, the views get wider, and somehow, your problems feel smaller.</p>

<h2>The Call of the Mountains</h2>
<p>For centuries, mountains have drawn people seeking clarity. Whether it's the Alps, the Himalayas, or your local ridge, the experience of climbing offers a unique form of meditation.</p>

<h2>Planning Your First Trek</h2>
<p>Start small. A day hike to a nearby peak can be just as rewarding as a multi-day expedition. The key is to be present — notice the changing vegetation, the sounds of water, the shift in temperature.</p>

<blockquote>Mountains teach patience. Every step upward is a lesson in persistence and the reward of steady effort.</blockquote>

<p>Pack light, bring water, and tell someone where you're going. These simple precautions free you to focus on the journey itself.</p>`,
    author: "Marcus Chen",
    date: "Feb 20, 2026",
    category: "Travel",
    image: article2,
    readTime: "4 min read",
  },
  {
    id: "3",
    title: "Urban Architecture: The Cities of Tomorrow",
    excerpt: "How modern architects are reimagining cityscapes with sustainable design and human-centered urban planning.",
    content: `<p>Cities are living organisms, constantly evolving to meet the needs of their inhabitants. Today's architects are designing with sustainability and livability at the forefront.</p>

<h2>Green Buildings, Better Lives</h2>
<p>Modern architecture isn't just about aesthetics — it's about creating spaces that reduce energy consumption while improving quality of life for residents.</p>

<h2>The Human Scale</h2>
<p>The best urban spaces prioritize pedestrians over cars, green spaces over parking lots, and community gathering places over isolated towers.</p>

<p>From Singapore's vertical gardens to Copenhagen's bicycle-first infrastructure, cities around the world are showing what's possible when design serves people.</p>`,
    author: "Elena Rodriguez",
    date: "Feb 18, 2026",
    category: "Architecture",
    image: article3,
    readTime: "6 min read",
  },
  {
    id: "4",
    title: "The Art of Slow Reading in a Fast World",
    excerpt: "Why taking your time with a good book might be the most productive thing you can do.",
    content: `<p>In an era of scrolling and skimming, the practice of deep, focused reading feels almost revolutionary. Yet it remains one of the most valuable habits we can cultivate.</p>

<h2>Reclaiming Your Attention</h2>
<p>Our brains are wired for distraction, but reading trains us to focus. Each page turned is an exercise in sustained attention — a skill that transfers to every area of life.</p>

<h2>Building a Reading Practice</h2>
<p>Start with just 20 minutes a day. Choose physical books when possible — the tactile experience enhances memory and comprehension. Create a dedicated reading space, free from screens.</p>

<blockquote>A reader lives a thousand lives before he dies. The man who never reads lives only one. — George R.R. Martin</blockquote>

<p>The goal isn't to read more books. It's to read more deeply, to sit with ideas, and to let them change you.</p>`,
    author: "David Park",
    date: "Feb 15, 2026",
    category: "Lifestyle",
    image: article4,
    readTime: "3 min read",
  },
  {
    id: "5",
    title: "Morning Routines: Fuel Your Day the Right Way",
    excerpt: "Simple breakfast habits that boost energy, focus, and overall well-being throughout the day.",
    content: `<p>How you start your morning sets the tone for everything that follows. A intentional morning routine — especially around nutrition — can transform your productivity and mood.</p>

<h2>The Science of Breakfast</h2>
<p>Your body has been fasting for 8+ hours. The first meal you eat triggers a cascade of hormonal and metabolic responses that influence your energy levels for hours.</p>

<h2>Simple, Powerful Habits</h2>
<p>You don't need elaborate meal prep. Fresh fruit, whole grains, and a source of protein create a balanced foundation. Add coffee or tea mindfully — as a pleasure, not a crutch.</p>

<p>The most important thing? Sit down. Eat slowly. Give your body and mind a calm, nourishing start before the demands of the day take over.</p>`,
    author: "Amy Foster",
    date: "Feb 12, 2026",
    category: "Health",
    image: article5,
    readTime: "4 min read",
  },
  {
    id: "6",
    title: "Creativity Unleashed: Why Making Art Matters",
    excerpt: "The surprising benefits of creative expression and why everyone should make time for art.",
    content: `<p>You don't have to be an artist to benefit from creative expression. The act of making — painting, writing, sculpting, even doodling — activates parts of the brain that analytical work simply can't reach.</p>

<h2>Art as Therapy</h2>
<p>Research consistently shows that creative activities reduce stress, improve mood, and enhance cognitive function. It's not about the result — it's about the process.</p>

<h2>Getting Started</h2>
<p>Give yourself permission to be bad at it. Buy some cheap supplies. Set a timer for 15 minutes and just make something. The barrier to entry is lower than you think.</p>

<blockquote>Every child is an artist. The problem is how to remain an artist once we grow up. — Pablo Picasso</blockquote>

<p>Creativity isn't a talent reserved for the few. It's a fundamental human capacity waiting to be exercised.</p>`,
    author: "Liam O'Brien",
    date: "Feb 8, 2026",
    category: "Culture",
    image: article6,
    readTime: "5 min read",
  },
];
