import { http, HttpResponse } from "msw";

const BASE = "https://api.ainative.studio/api/v1/public";

const today = new Date();
const trendDays = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - (29 - i));
  return {
    platform: "tiktok" as const,
    date: d.toISOString().slice(0, 10),
    views: 2000 + i * 200,
    likes: 200 + i * 30,
    comments: 50 + i * 5,
    shares: 30 + i * 8,
    followers_gained: 10 + i * 3,
  };
});

export const handlers = [
  http.get(`${BASE}/credits/balance`, () =>
    HttpResponse.json({
      remaining_credits: 8500,
      total_credits: 10000,
      used_credits: 1500,
    })
  ),

  http.get(`${BASE}/twins`, () =>
    HttpResponse.json([
      { id: "t1", name: "Professional Sarah", style: "Corporate", voice: "Pro Female", voice_id: "pro-female", style_tags: ["corporate"], videos: 24, color: "from-blue-500 to-cyan-500" },
      { id: "t2", name: "Energetic Alex", style: "Bold", voice: "Casual Male", voice_id: "casual-male", style_tags: ["bold"], videos: 18, color: "from-orange-500 to-pink-500" },
    ])
  ),

  http.post(`${BASE}/twins`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ id: `t${Date.now()}`, ...body, videos: 0 }, { status: 201 });
  }),

  http.patch(`${BASE}/twins/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ id: params.id, ...body });
  }),

  http.delete(`${BASE}/twins/:id`, () => new HttpResponse(null, { status: 204 })),

  http.get(`${BASE}/content/calendar`, () =>
    HttpResponse.json([
      { id: "e1", title: "Morning Hacks", date: new Date().toISOString(), platform: "tiktok", status: "scheduled" },
    ])
  ),

  http.post(`${BASE}/content/calendar`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ id: `e${Date.now()}`, ...body }, { status: 201 });
  }),

  http.patch(`${BASE}/content/calendar/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ id: params.id, ...body });
  }),

  http.delete(`${BASE}/content/calendar/:id`, () => new HttpResponse(null, { status: 204 })),

  http.get(`${BASE}/tasks/:id`, ({ params }) =>
    HttpResponse.json({
      task_id: params.id,
      status: "done",
      progress: 100,
      result: { url: "https://example.com/result.mp4" },
    })
  ),

  http.post(`${BASE}/memory/v2/remember`, () =>
    HttpResponse.json({ id: `mem-${Date.now()}` }, { status: 201 })
  ),

  http.post(`${BASE}/memory/v2/recall`, () =>
    HttpResponse.json([
      { id: "mem-1", content: "User prefers educational tone", score: 0.92 },
    ])
  ),

  http.get(`${BASE}/analytics/social`, () =>
    HttpResponse.json({
      views: 142830,
      likes: 12430,
      shares: 3210,
      engagement_rate: 8.7,
      completion_rate: 87,
      trend: trendDays,
      top_videos: [
        { title: "3 Productivity Hacks", platform: "tiktok", views: 42000, likes: 3800, eng: 9.0, twin: "Professional Sarah" },
        { title: "AI Tools for Creators", platform: "instagram", views: 28000, likes: 2100, eng: 7.5, twin: "Energetic Alex" },
      ],
      platform_breakdown: [
        { platform: "tiktok", views: 68000 },
        { platform: "instagram", views: 42000 },
        { platform: "linkedin", views: 22000 },
        { platform: "youtube", views: 10830 },
      ],
    })
  ),

  http.get(`${BASE}/analytics/social/summary`, () =>
    HttpResponse.json({
      total_views: 142830,
      total_likes: 12430,
      total_shares: 3210,
      total_followers_gained: 1840,
      engagement_rate: 8.7,
      delta_views: 18400,
      delta_likes: 1240,
      delta_shares: 220,
    })
  ),

  http.post(`${BASE}/analytics/social/export`, () =>
    HttpResponse.json({ task_id: `task-${Date.now()}` }, { status: 201 })
  ),

  http.post(`${BASE}/multimodal/tts`, () =>
    HttpResponse.json({ audio_url: "https://example.com/audio.mp3", duration_ms: 18000 }, { status: 201 })
  ),

  http.post(`${BASE}/captions/generate`, () =>
    HttpResponse.json({
      caption_id: `cap-${Date.now()}`,
      task_id: `task-${Date.now()}`,
      status: "done",
    }, { status: 201 })
  ),

  http.get(`${BASE}/captions/:id`, ({ params }) =>
    HttpResponse.json({
      id: params.id,
      status: "done",
      srt: "1\n00:00:00,000 --> 00:00:02,000\nStop scrolling.\n\n2\n00:00:02,500 --> 00:00:05,000\nHere are three productivity hacks.",
      segments: [
        { start: 0, end: 2.0, text: "Stop scrolling." },
        { start: 2.5, end: 5.0, text: "Here are three productivity hacks." },
      ],
    })
  ),

  http.post(`${BASE}/captions/:id/burn-in`, () =>
    HttpResponse.json({ task_id: `task-${Date.now()}`, status: "queued" }, { status: 201 })
  ),

  http.post(`${BASE}/bulk/reels`, () =>
    HttpResponse.json({
      task_id: `task-${Date.now()}`,
      batch_id: `batch-${Date.now()}`,
      status: "queued",
      progress: 0,
      total_rows: 5,
    }, { status: 201 })
  ),

  http.get(`${BASE}/bulk/reels/:id`, ({ params }) =>
    HttpResponse.json({
      task_id: `task-${params.id}`,
      batch_id: params.id,
      status: "done",
      progress: 100,
      total_rows: 2,
      items: [
        { row: 1, status: "done", result_url: "https://example.com/reel1.mp4" },
        { row: 2, status: "done", result_url: "https://example.com/reel2.mp4" },
      ],
    })
  ),

  http.get(`${BASE}/social/accounts`, () =>
    HttpResponse.json([
      { id: "acc-1", platform: "instagram", handle: "@studio_demo", connected_at: new Date().toISOString() },
      { id: "acc-2", platform: "tiktok", handle: "@studio_demo", connected_at: new Date().toISOString() },
    ])
  ),

  http.post(`${BASE}/social/publish`, async ({ request }) => {
    const body = await request.json() as { platforms: string[] };
    return HttpResponse.json({
      results: body.platforms.map((p) => ({ platform: p, task_id: `task-${Date.now()}`, status: "queued" })),
    });
  }),

  http.delete(`${BASE}/social/disconnect/:platform`, () => new HttpResponse(null, { status: 204 })),

  http.post(`${BASE}/multimodal/avatar/generate`, () =>
    HttpResponse.json({ job_id: `job-${Date.now()}` }, { status: 201 })
  ),

  http.post(`${BASE}/agents`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ agent_id: `agent-${Date.now()}`, ...body }, { status: 201 });
  }),

  http.post(`${BASE}/chat/completions`, () =>
    HttpResponse.text(
      'data: {"choices":[{"delta":{"content":"Stop"}}]}\ndata: {"choices":[{"delta":{"content":" scrolling."}}]}\ndata: [DONE]\n',
      { headers: { "Content-Type": "text/event-stream" } }
    )
  ),
];
