export type Platform = "instagram" | "tiktok" | "linkedin" | "youtube";

export const platformMeta: Record<Platform, { label: string; color: string; dot: string }> = {
  instagram: { label: "Instagram", color: "bg-pink-500/20 text-pink-300 border-pink-500/30", dot: "bg-pink-500" },
  tiktok: { label: "TikTok", color: "bg-zinc-500/20 text-zinc-200 border-zinc-500/30", dot: "bg-zinc-200" },
  linkedin: { label: "LinkedIn", color: "bg-blue-500/20 text-blue-300 border-blue-500/30", dot: "bg-blue-500" },
  youtube: { label: "YouTube", color: "bg-red-500/20 text-red-300 border-red-500/30", dot: "bg-red-500" },
};

export const mockStats = {
  credits: 12430,
  creditsTotal: 20000,
  contentThisMonth: 47,
  scheduled: 12,
  rendered: 89,
};

export const mockActivity = [
  { id: 1, type: "render", label: "Rendered 'Morning Routine Hacks'", time: "2m ago", status: "success" },
  { id: 2, type: "publish", label: "Published to Instagram + TikTok", time: "14m ago", status: "success" },
  { id: 3, type: "script", label: "Generated script: 'AI for Beginners'", time: "1h ago", status: "success" },
  { id: 4, type: "render", label: "Batch job #2847 completed (24 reels)", time: "3h ago", status: "success" },
  { id: 5, type: "twin", label: "Created twin: Professional Sarah", time: "5h ago", status: "success" },
  { id: 6, type: "publish", label: "Scheduled 'Productivity Tips' for tomorrow", time: "8h ago", status: "pending" },
  { id: 7, type: "render", label: "Render failed: 'Deep Work'", time: "1d ago", status: "error" },
  { id: 8, type: "script", label: "Edited script: 'Cold Email Tips'", time: "1d ago", status: "success" },
];

export const mockScripts = [
  { id: "s1", title: "Morning Routine Hacks", platform: "tiktok" as Platform, duration: 30, tone: "Educational", date: "Apr 28", status: "published" },
  { id: "s2", title: "AI for Beginners", platform: "youtube" as Platform, duration: 60, tone: "Educational", date: "Apr 27", status: "draft" },
  { id: "s3", title: "Cold Email Tips", platform: "linkedin" as Platform, duration: 60, tone: "Professional", date: "Apr 26", status: "scheduled" },
  { id: "s4", title: "Productivity Stack 2026", platform: "instagram" as Platform, duration: 30, tone: "Educational", date: "Apr 25", status: "draft" },
  { id: "s5", title: "Why Most Creators Fail", platform: "tiktok" as Platform, duration: 15, tone: "Inspirational", date: "Apr 24", status: "published" },
  { id: "s6", title: "Deep Work in 30 Days", platform: "youtube" as Platform, duration: 60, tone: "Educational", date: "Apr 23", status: "draft" },
];

export const mockTwins = [
  { id: "t1", name: "Professional Sarah", style: "Corporate", voice: "Pro Female", videos: 24, color: "from-blue-500 to-cyan-500" },
  { id: "t2", name: "Energetic Alex", style: "Bold", voice: "Casual Male", videos: 18, color: "from-orange-500 to-pink-500" },
  { id: "t3", name: "Calm Maya", style: "Minimal", voice: "Soft Female", videos: 31, color: "from-emerald-500 to-teal-500" },
  { id: "t4", name: "Neon Kai", style: "Neon", voice: "Pro Male", videos: 12, color: "from-fuchsia-500 to-purple-500" },
  { id: "t5", name: "Academic Dr. Lin", style: "Academic", voice: "Pro Female", videos: 9, color: "from-indigo-500 to-blue-500" },
  { id: "t6", name: "Creator Jay", style: "Creator", voice: "Casual Male", videos: 16, color: "from-yellow-500 to-orange-500" },
];

export const mockCalendarEvents = (() => {
  const today = new Date();
  const items: { id: string; title: string; date: Date; platform: Platform; status: string }[] = [];
  const titles = ["Morning Hacks", "AI Basics", "Cold Email", "Productivity", "Deep Work", "Creator Tips", "Quick Win", "Mindset Shift"];
  for (let i = 0; i < 18; i++) {
    const offset = Math.floor(Math.random() * 28) - 7;
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    const platforms: Platform[] = ["instagram", "tiktok", "linkedin", "youtube"];
    items.push({
      id: `e${i}`,
      title: titles[i % titles.length] + (i > 7 ? ` v${Math.floor(i / 8) + 1}` : ""),
      date: d,
      platform: platforms[i % 4],
      status: ["scheduled", "draft", "published"][i % 3],
    });
  }
  return items;
})();

export const mockAnalyticsTrend = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  views: Math.floor(2000 + Math.random() * 8000 + i * 200),
  engagement: Math.floor(200 + Math.random() * 800 + i * 30),
}));

export const mockTopVideos = [
  { title: "Morning Routine Hacks", platform: "tiktok" as Platform, views: 142830, likes: 12430, eng: 8.7, twin: "Energetic Alex" },
  { title: "AI for Beginners", platform: "youtube" as Platform, views: 98220, likes: 8821, eng: 9.0, twin: "Professional Sarah" },
  { title: "Why Most Creators Fail", platform: "tiktok" as Platform, views: 76540, likes: 6602, eng: 8.6, twin: "Creator Jay" },
  { title: "Cold Email Tips", platform: "linkedin" as Platform, views: 54210, likes: 4120, eng: 7.6, twin: "Professional Sarah" },
  { title: "Productivity Stack", platform: "instagram" as Platform, views: 41230, likes: 3520, eng: 8.5, twin: "Calm Maya" },
];

// Simulated streaming script generator
export async function* streamScript(topic: string, tone: string, duration: number, platform: string) {
  const hooks = [
    `Stop scrolling. ${topic} just changed.`,
    `Nobody's talking about ${topic}. Here's why.`,
    `${topic} in ${duration} seconds. Go.`,
  ];
  const body = [
    `\n\n**Hook:** ${hooks[Math.floor(Math.random() * hooks.length)]}\n\n`,
    `**The Problem:** Most people approach ${topic.toLowerCase()} the wrong way. They overthink it, overcomplicate it, and end up doing nothing.\n\n`,
    `**The Shift:** Here's the ${tone.toLowerCase()} truth — small consistent action beats perfect strategy every single time.\n\n`,
    `**3 Steps:**\n1. Start before you feel ready.\n2. Track one tiny metric daily.\n3. Share what you learn publicly.\n\n`,
    `**CTA:** Follow for more ${platform}-optimized breakdowns. Save this for later.\n\n_— Optimized for ${duration}s ${platform} delivery._`,
  ];
  const full = body.join("");
  const words = full.split(/(\s+)/);
  for (const w of words) {
    await new Promise((r) => setTimeout(r, 18 + Math.random() * 40));
    yield w;
  }
}