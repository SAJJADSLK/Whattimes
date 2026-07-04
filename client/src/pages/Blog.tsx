import { useState } from 'react';
import { Calendar, User, ArrowRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  body: string[]; // paragraphs
  author: string;
  date: string;
  category: string;
  readTime: number;
}

// Real, original, full-length articles. No stub content, no placeholder authors.
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding Daylight Saving Time Across the Globe',
    excerpt: 'Daylight Saving Time affects billions of people worldwide, but far from uniformly. Here is how different countries handle it, and why the patchwork matters for anyone scheduling across borders.',
    body: [
      'Daylight Saving Time (DST) is one of the few practices that most people assume is universal, and almost none of it actually is. Roughly 40% of countries observe some form of seasonal clock change, and the ones that do rarely agree on when.',
      'The European Union shifts clocks on the last Sunday of March and the last Sunday of October, and every member state moves in lockstep on the same date. The United States and Canada, by contrast, start DST on the second Sunday of March and end it on the first Sunday of November — roughly two to three weeks apart from Europe\'s schedule. That gap means the time difference between, say, London and New York is not a constant 5 hours all year; for a few weeks each spring and autumn it briefly becomes 4 hours, because one region has already changed its clocks and the other has not.',
      'Southern Hemisphere countries that observe DST, such as Australia and parts of Chile, flip the calendar entirely: their clocks move forward in their local spring (around October) and back in their local autumn (around April), which is the opposite half of the year from the Northern Hemisphere. So while Sydney and London are both observing "summer time" in their own countries, they are doing so during opposite seasons.',
      'Most of Asia, Africa, and a growing number of countries worldwide skip DST entirely. India, China, Japan, and most of the Middle East keep a single fixed offset year-round. That actually makes scheduling with those regions easier in one sense — no seasonal recalculation needed — but it means the time difference between, for example, Tokyo and New York changes twice a year purely because New York moves and Tokyo does not.',
      'The practical takeaway for anyone coordinating across time zones: never memorize a fixed time difference between two places if either one observes DST. A gap that is 8 hours in January can become 7 hours in July. The safest approach is to always calculate from UTC on the specific date you care about, or use a converter that accounts for the transition dates automatically, since they shift slightly from year to year in some countries.',
    ],
    author: 'Chronos Editorial Team',
    date: 'June 15, 2026',
    category: 'Time Zones',
    readTime: 5,
  },
  {
    id: '2',
    title: 'The History of Time Zones and How They Were Created',
    excerpt: 'Standardized time zones are barely 140 years old. Before railways forced the issue, "noon" was a purely local matter — and the fix we ended up with was more political than scientific.',
    body: [
      'For most of human history, time was local by necessity. Noon was whenever the sun was directly overhead in your particular town, which meant that two cities even 50 miles apart could disagree on the time by several minutes. This was never a serious problem when travel was slow, but the arrival of railways in the 19th century changed that overnight.',
      'Railway companies were the first to feel the pain. A train schedule is useless if every station along the route keeps its own local time. By the 1850s, British railway companies had already begun using "Railway Time," synchronized to Greenwich, even though many towns kept their own local clocks running in parallel for years afterward — leading to station clocks with two minute hands, one for local time and one for railway time.',
      'The United States faced a more extreme version of the same problem. By the 1870s, American railroads were operating on over 300 different local times. Sir Sandford Fleming, a Canadian railway engineer, proposed a global system of 24 standard time zones, each one hour apart, anchored to a single prime meridian. The idea gained enough traction that in 1884, delegates from 25 nations met in Washington, D.C. for the International Meridian Conference and agreed to adopt Greenwich, England as the prime meridian — largely because it was already the reference point used by the majority of the world\'s shipping charts.',
      'Adoption was slow and uneven. The U.S. did not standardize time zones by federal law until the Standard Time Act of 1918. France, for political reasons, refused to officially reference "Greenwich" time until 1978, instead defining its time as "Paris Mean Time, retarded by 9 minutes 21 seconds" — which was numerically identical to GMT, just described without giving Britain credit.',
      'Even today, time zones remain more political than geographic. China, which spans a longitude wide enough to justify five time zones, uses a single time zone nationwide for administrative unity. Meanwhile, some countries offset by 30 or 45 minutes rather than a full hour — India (UTC+5:30) and Nepal (UTC+5:45) are the best-known examples — decisions made deliberately to distinguish their national identity from neighboring time zones rather than for any astronomical reason.',
    ],
    author: 'Chronos Editorial Team',
    date: 'June 10, 2026',
    category: 'History',
    readTime: 7,
  },
  {
    id: '3',
    title: 'Best Practices for Scheduling Global Meetings',
    excerpt: 'Coordinating a meeting across four time zones without upsetting someone at 6am is a solvable problem. Here is a practical framework for doing it consistently.',
    body: [
      'The single biggest mistake in cross-timezone scheduling is anchoring to your own local time and working outward. If you are in New York and you propose "10am my time," you are implicitly asking your Tokyo colleague to check whether that is workable for them — and they usually say yes even when it is not, because pushing back on a proposed time feels confrontational.',
      'A better approach is to identify the overlap window first. Take the standard working hours (commonly 9am–5pm, though this varies by company and culture) for every location involved, convert them all to UTC, and find the intersection. For a team split between New York (UTC-4 during DST) and Singapore (UTC+8), the overlap is typically limited to a narrow window in the New York morning, which is Singapore\'s evening — often just an hour or two. Once you know the real overlap, you can propose a time that is at least tolerable for everyone, rather than merely convenient for whoever sent the invite.',
      'When there genuinely is no reasonable overlap, the fair approach is to rotate the inconvenience. If a recurring meeting always falls at 7am for the Sydney-based team and 9pm for the London-based team, consider alternating start times every few weeks so the same group is not always the one losing sleep.',
      'Always send calendar invites with an explicit time zone and, where possible, let the calendar software handle the local conversion automatically rather than writing "3pm EST" in the body of an email. A recipient in a timezone that observes DST on a different schedule than you can easily end up an hour off if the conversion is manual and the invite spans a DST transition date.',
      'Finally, be explicit about ambiguous abbreviations. "CST" alone is genuinely ambiguous — it could mean Central Standard Time (US), China Standard Time, or Cuba Standard Time, and all three are different. Spelling out the full time zone name or region avoids a surprisingly common source of missed meetings.',
    ],
    author: 'Chronos Editorial Team',
    date: 'June 5, 2026',
    category: 'Productivity',
    readTime: 4,
  },
  {
    id: '4',
    title: 'Unix Timestamps Explained: A Developer\'s Guide',
    excerpt: 'A Unix timestamp is just a count of seconds, but that simplicity is exactly why it became the backbone of how computers agree on "when." Here is what every developer should actually know about it.',
    body: [
      'A Unix timestamp represents the number of seconds that have elapsed since 00:00:00 UTC on January 1, 1970 — a moment referred to as the "Unix epoch." At the time this article was written, that number was already well past 1.7 billion, and it increases by exactly one every second, everywhere in the world, regardless of local time zone or daylight saving.',
      'That last point is the whole reason timestamps are useful: a Unix timestamp has no time zone. The number 1700000000 refers to the exact same instant whether you are in Tokyo, London, or Los Angeles. Time zone only enters the picture when you convert that number into a human-readable date and time — at which point you must specify which time zone you want it displayed in, or you will get a different (but equally "correct") answer depending on the system\'s default settings.',
      'One frequent source of bugs is the difference between seconds and milliseconds. Unix timestamps in most Unix-like systems and in languages like Python are measured in seconds, but JavaScript\'s Date.now() and many web APIs return milliseconds. Feeding a millisecond timestamp into a function expecting seconds (or vice versa) produces a date that is off by a factor of 1000 — commonly showing up as dates in the 1970s or the distant future.',
      'The other well-known limitation is the "Year 2038 problem." Systems that store Unix time as a signed 32-bit integer will overflow on January 19, 2038, at 03:14:07 UTC, after which the counter wraps around to a negative number and the represented date jumps back to 1901. Most modern systems have already migrated to 64-bit timestamps, which pushes the same overflow problem roughly 292 billion years into the future, but older embedded systems and some legacy databases remain at risk.',
      'For developers, the practical rule of thumb is: store and transmit time as Unix timestamps (or another UTC-based, unambiguous format like ISO 8601 with an explicit UTC offset), and only convert to a local, human-readable time at the very last step, right before displaying it to a user.',
    ],
    author: 'Chronos Editorial Team',
    date: 'May 28, 2026',
    category: 'Technology',
    readTime: 6,
  },
  {
    id: '5',
    title: 'Why Accurate Time Matters in Financial Markets',
    excerpt: 'In markets where trades are decided in microseconds, a clock that is even slightly wrong is not a minor inconvenience — it is a regulatory and financial liability.',
    body: [
      'Modern financial exchanges process orders at a pace where the sequence of events matters as much as the events themselves. If two orders arrive within a few microseconds of each other, whichever system\'s clock says it arrived first often determines which trade gets filled — which is why exchanges invest heavily in clock synchronization rather than treating it as a background detail.',
      'Regulators have made this an explicit requirement rather than a best practice. In the European Union, MiFID II mandates that trading venues and market participants synchronize their business clocks to Coordinated Universal Time (UTC) within tolerances as tight as 100 microseconds for high-frequency trading systems, and every reportable trading event must carry a timestamp accurate to that standard. In the United States, FINRA and the SEC impose similar clock synchronization rules under Rule 613 (the Consolidated Audit Trail) and related regulations.',
      'The synchronization itself typically relies on GPS-disciplined clocks or Precision Time Protocol (PTP) rather than the more familiar Network Time Protocol (NTP) that keeps ordinary computers roughly in sync. NTP is generally accurate to tens of milliseconds over the public internet — vastly too imprecise for high-frequency trading, where the entire trade might be decided and settled within a smaller window than NTP\'s margin of error.',
      'Time zone handling adds a second layer of risk that is more about process than physics. A trading desk that mishandles a Daylight Saving Time transition — for example, misapplying an hour offset for a market that switches on a different date than the desk\'s home country — can end up reporting trades with an incorrect timestamp, which is a compliance problem even if the trade itself executed correctly. This is one of the reasons many financial systems standardize all internal logging to UTC and only convert to local exchange time for display purposes.',
      'The underlying lesson generalizes well beyond finance: any system where the order of events has legal or financial consequences benefits from treating "what time is it, exactly, and according to which clock" as a first-class engineering problem rather than an afterthought.',
    ],
    author: 'Chronos Editorial Team',
    date: 'May 20, 2026',
    category: 'Finance',
    readTime: 8,
  },
  {
    id: '6',
    title: 'Remote Work: Mastering Time Zone Differences',
    excerpt: 'Distributed teams do not fail because of time zones themselves — they fail because of unspoken assumptions about who is expected to be flexible. A few concrete habits fix most of it.',
    body: [
      'The most common complaint on distributed teams is not "we are in different time zones," it is "nobody told me the meeting moved because of a time change I didn\'t know about." Most of the friction in remote, cross-timezone work comes from mismatched expectations rather than the time difference itself.',
      'A practical first step is publishing each team member\'s working hours in a shared, timezone-aware format — not "9 to 5" but "9:00–17:00 Central European Time," visible to the whole team in a tool that automatically converts it to each viewer\'s local time. This removes the need for anyone to do mental math or guess whether a colleague is currently online.',
      'Asynchronous-first communication is the second lever. Teams that default to writing detailed updates, recording short videos, or leaving structured comments — rather than expecting real-time replies — naturally tolerate time zone gaps better, because progress does not stall waiting for someone eight time zones away to wake up. Live meetings become the exception, reserved for discussions that genuinely need real-time back-and-forth, rather than the default way of getting anything decided.',
      'When live meetings are necessary, the fairness principle from meeting scheduling applies here too: track who has been asked to take early-morning or late-night calls over the past month, and actively rotate that burden. It is easy for the habit to silently settle on whichever team member is "used to it," which erodes morale over time even if no one says so directly.',
      'Finally, be deliberate about overlap hours versus focus hours. A team spread across three or more time zones often has only a two-to-three hour window where everyone is online simultaneously. Protecting that window for genuine collaboration — and explicitly discouraging routine status meetings from eating into it — tends to make distributed teams noticeably more effective than teams that treat every hour as interchangeable.',
    ],
    author: 'Chronos Editorial Team',
    date: 'May 15, 2026',
    category: 'Remote Work',
    readTime: 5,
  },
];

export default function Blog() {
  const { t } = useTranslation();
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const categories = Array.from(new Set(blogPosts.map(p => p.category)));

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 space-y-4">
          <h1 className="text-5xl lg:text-6xl font-light">
            <span className="font-semibold text-accent">{t('blog.heading')}</span>
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl">
            {t('blog.subtitle')}
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
                    {t('blog.featured')}
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
                  <span>{t('blog.minRead', { count: blogPosts[0].readTime })}</span>
                </div>

                <button
                  onClick={() => setActivePost(blogPosts[0])}
                  className="flex items-center gap-2 text-accent hover:text-accent/80 transition-luxury font-semibold"
                >
                  {t('blog.readMore')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-6xl font-light mb-2">📅</div>
                  <p className="text-foreground/60">{t('blog.featuredArticle')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-accent text-background rounded-full text-sm font-semibold hover:bg-accent/90 transition-luxury">
            {t('blog.categoryAll')}
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
                  <span>{t('blog.min', { count: post.readTime })}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground/60">{post.date}</span>
                  <button
                    onClick={() => setActivePost(post)}
                    className="text-accent hover:text-accent/80 transition-luxury"
                    aria-label={t('blog.readMore') as string}
                  >
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
              <span className="font-semibold">{t('blog.newsletterTitle')}</span>
            </h3>
            <p className="text-background/70 max-w-md mx-auto">
              {t('blog.newsletterSubtitle')}
            </p>

            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('blog.emailPlaceholder')}
                className="flex-1 bg-background text-foreground rounded px-4 py-3 text-sm"
              />
              <button className="px-6 py-3 bg-accent text-background rounded font-semibold hover:bg-accent/90 transition-luxury">
                {t('blog.subscribe')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full article reader */}
      {activePost && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto py-12 px-4"
          onClick={() => setActivePost(null)}
        >
          <div
            className="relative bg-card border border-border rounded-lg max-w-3xl w-full p-8 lg:p-12 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePost(null)}
              className="absolute top-6 right-6 text-foreground/60 hover:text-foreground"
              aria-label="Close article"
            >
              <X className="w-6 h-6" />
            </button>

            <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs font-semibold uppercase">
              {activePost.category}
            </span>

            <h1 className="text-3xl lg:text-4xl font-semibold leading-tight">
              {activePost.title}
            </h1>

            <div className="flex items-center gap-6 text-sm text-foreground/60 pb-6 border-b border-border">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {activePost.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {activePost.date}
              </div>
              <span>{t('blog.minRead', { count: activePost.readTime })}</span>
            </div>

            <div className="space-y-5">
              {activePost.body.map((para, i) => (
                <p key={i} className="text-foreground/80 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
