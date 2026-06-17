import { Calendar, User, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: number;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding Daylight Saving Time Across the Globe',
    excerpt: 'Daylight Saving Time affects billions of people worldwide. Learn how different countries implement DST and why it matters for global coordination.',
    author: 'Sarah Chen',
    date: 'June 15, 2026',
    category: 'Time Zones',
    readTime: 5,
  },
  {
    id: '2',
    title: 'The History of Time Zones and How They Were Created',
    excerpt: 'Discover how the world was divided into 24 time zones and the fascinating history behind this global standard.',
    author: 'James Wilson',
    date: 'June 10, 2026',
    category: 'History',
    readTime: 7,
  },
  {
    id: '3',
    title: 'Best Practices for Scheduling Global Meetings',
    excerpt: 'Coordinating meetings across time zones is challenging. Here are proven strategies for finding the perfect meeting time.',
    author: 'Maria Garcia',
    date: 'June 5, 2026',
    category: 'Productivity',
    readTime: 4,
  },
  {
    id: '4',
    title: 'Unix Timestamps Explained: A Developer\'s Guide',
    excerpt: 'Unix timestamps are fundamental to computing. Learn how they work, why they matter, and how to use them effectively.',
    author: 'Alex Kumar',
    date: 'May 28, 2026',
    category: 'Technology',
    readTime: 6,
  },
  {
    id: '5',
    title: 'Why Accurate Time Matters in Financial Markets',
    excerpt: 'In high-frequency trading, milliseconds matter. Explore how precise time synchronization is critical for financial operations.',
    author: 'David Lee',
    date: 'May 20, 2026',
    category: 'Finance',
    readTime: 8,
  },
  {
    id: '6',
    title: 'Remote Work: Mastering Time Zone Differences',
    excerpt: 'Remote teams span continents. Discover strategies for managing time zone differences and maintaining productivity.',
    author: 'Emma Thompson',
    date: 'May 15, 2026',
    category: 'Remote Work',
    readTime: 5,
  },
];

export default function Blog() {
  const { t } = useTranslation();

  const categories = Array.from(new Set(blogPosts.map(p => p.category)));

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 space-y-4">
          <h1 className="text-5xl lg:text-6xl font-light">
            <span className="font-semibold text-accent">Blog & News</span>
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl">
            Insights, tips, and stories about time, timezones, and global coordination
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16 relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg blur-2xl" />
          
          <div className="relative bg-card border border-border rounded-lg overflow-hidden luxury-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              <div className="space-y-6">
                <div className="inline-block">
                  <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-semibold uppercase">
                    Featured
                  </span>
                </div>

                <h2 className="text-3xl font-light">
                  <span className="font-semibold">{blogPosts[0].title}</span>
                </h2>

                <p className="text-foreground/70 leading-relaxed">
                  {blogPosts[0].excerpt}
                </p>

                <div className="flex items-center gap-6 text-sm text-foreground/60">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {blogPosts[0].author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {blogPosts[0].date}
                  </div>
                  <span>{blogPosts[0].readTime} min read</span>
                </div>

                <button className="flex items-center gap-2 text-accent hover:text-accent/80 transition-luxury font-semibold">
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-6xl font-light mb-2">📅</div>
                  <p className="text-foreground/60">Featured Article</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-accent text-background rounded-full text-sm font-semibold hover:bg-accent/90 transition-luxury">
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className="px-4 py-2 bg-foreground/10 hover:bg-foreground/20 rounded-full text-sm font-semibold transition-luxury"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map(post => (
            <div
              key={post.id}
              className="minimalist-card flex flex-col"
            >
              <div className="space-y-4 flex-1">
                <div className="inline-block">
                  <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs font-semibold uppercase">
                    {post.category}
                  </span>
                </div>

                <h3 className="text-lg font-semibold leading-tight">
                  {post.title}
                </h3>

                <p className="text-sm text-foreground/70">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                <div className="flex items-center justify-between text-xs text-foreground/60">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    {post.author}
                  </div>
                  <span>{post.readTime} min</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground/60">{post.date}</span>
                  <button className="text-accent hover:text-accent/80 transition-luxury">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-20 relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg blur-2xl" />
          
          <div className="relative bg-foreground text-background rounded-lg p-12 text-center space-y-6">
            <h3 className="text-3xl font-light">
              <span className="font-semibold">Subscribe to Our Newsletter</span>
            </h3>
            <p className="text-background/70 max-w-md mx-auto">
              Get the latest articles about time zones, scheduling, and global coordination delivered to your inbox
            </p>

            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-background text-foreground rounded px-4 py-3 text-sm"
              />
              <button className="px-6 py-3 bg-accent text-background rounded font-semibold hover:bg-accent/90 transition-luxury">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
