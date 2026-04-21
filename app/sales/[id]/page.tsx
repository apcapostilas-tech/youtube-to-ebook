import { notFound } from "next/navigation";
import { getJob } from "@/lib/jobs";

function getThemeCSS(theme: string): string {
  if (theme === "light") return `
    body{background:#f5f5fa!important;color:#1e1e3f!important}
    .hero-bg{background:linear-gradient(135deg,#e8eaf6,#fce4ec 35%,#e8f5e9 60%,#e3f2fd)!important;background-size:300% 300%}
    .hero-grid{background-image:linear-gradient(rgba(99,102,241,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.06) 1px,transparent 1px)!important}
    .hero-glow{background:radial-gradient(circle,rgba(99,102,241,.15) 0%,transparent 70%)!important}
    .float-shape.a{background:radial-gradient(circle,#6366f1,transparent)!important}
    .float-shape.b{background:radial-gradient(circle,#ec4899,transparent)!important}
    .hero-badge{background:rgba(99,102,241,.1)!important;border-color:rgba(99,102,241,.3)!important;color:#4338ca!important}
    .hero h1{color:#1e1e3f!important}.hero h1 em{color:#6366f1!important}
    .hero-sub{color:#4040a0!important}.hero-meta{color:#8080c0!important}
    .btn-hero,.btn-offer{background:linear-gradient(135deg,#6366f1,#8b5cf6)!important}
    @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,.45)}50%{box-shadow:0 0 0 18px rgba(99,102,241,0)}}
    .stats-bar{background:#ffffff!important;border-color:#e2e2f0!important}
    .stat-num{background:linear-gradient(135deg,#6366f1,#8b5cf6)!important;-webkit-background-clip:text!important;background-clip:text!important}
    .stat-label{color:#8080c0!important}
    section{background:#f5f5fa!important;border-color:#e2e2f0!important}
    .tag{color:#6366f1!important}.tag::before{background:#6366f1!important}
    h2{color:#1e1e3f!important}p.body{color:#4040a0!important}
    .benefits li{color:#1e1e3f!important;border-color:#e2e2f0!important}
    .check{background:linear-gradient(135deg,#10b981,#34d399)!important}
    .prog-track{background:rgba(99,102,241,.1)!important}
    .prog-fill{background:linear-gradient(90deg,#6366f1,#8b5cf6)!important}
    .prog-labels{color:#1e1e3f!important}.prog-labels span:last-child{color:#6366f1!important}
    .review{background:#ffffff!important;border-color:#e2e2f0!important}
    .review::before{background:linear-gradient(90deg,#6366f1,#8b5cf6)!important}
    .review-text{color:#4040a0!important}.rev-name{color:#1e1e3f!important}.rev-role{color:#8080c0!important}
    .avatar{background:linear-gradient(135deg,#6366f1,#8b5cf6)!important}
    .offer-box{background:#ffffff!important;border-color:#e2e2f0!important}
    .offer-list li{color:#1e1e3f!important;border-color:#e2e2f0!important}
    .urgency-box{background:rgba(99,102,241,.08)!important;border-color:rgba(99,102,241,.2)!important;color:#4338ca!important}
    .faq details{border-color:#e2e2f0!important}.faq details[open]{border-color:rgba(99,102,241,.3)!important}
    .faq summary{color:#1e1e3f!important}.faq summary::after{color:#6366f1!important}
    .faq details p{color:#4040a0!important}
    .final{background:linear-gradient(180deg,transparent,rgba(99,102,241,.05))!important}
    footer{border-color:#e2e2f0!important;color:#8080c0!important}
    .donut-section{background:radial-gradient(ellipse at 50% 50%,rgba(99,102,241,.04) 0%,transparent 70%)!important}
    .donut-pct{background:linear-gradient(135deg,#1e1e3f,#6366f1)!important;-webkit-background-clip:text!important;background-clip:text!important}
    .donut-label{color:#8080c0!important}
    .donut-item{background:#ffffff!important;border-color:#e2e2f0!important}
    .donut-item-num{background:linear-gradient(135deg,#1e1e3f,#6366f1)!important;-webkit-background-clip:text!important;background-clip:text!important}
    .donut-item-label{color:#8080c0!important}
    .stat{border-color:#e2e2f0!important;background:linear-gradient(135deg,rgba(99,102,241,.03),rgba(99,102,241,.01))!important}
    .stat::before{background:linear-gradient(90deg,transparent,#6366f1,#8b5cf6,transparent)!important}
    .prog-pct{background:linear-gradient(135deg,#6366f1,#8b5cf6)!important}
    .offer-item-name{color:#1e1e3f!important}
    .offer-item-price{color:#8080c0!important}
    .price-original{color:#8080c0!important}
    .guarantee-box{background:rgba(16,185,129,.06)!important;border-color:rgba(16,185,129,.2)!important}
    .guarantee-text{color:#065f46!important}
  `;
  if (theme === "bold") return `
    body{background:#06030f!important}
    .hero-bg{background:linear-gradient(135deg,#0a0518,#1a0530 35%,#08031a 60%,#05020f)!important;background-size:300% 300%}
    .hero-grid{background-image:linear-gradient(rgba(168,85,247,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,.06) 1px,transparent 1px)!important}
    .hero-glow{background:radial-gradient(circle,rgba(168,85,247,.2) 0%,transparent 70%)!important}
    .float-shape.a{background:radial-gradient(circle,#a855f7,transparent)!important}
    .float-shape.b{background:radial-gradient(circle,#ec4899,transparent)!important}
    .hero-badge{background:rgba(168,85,247,.12)!important;border-color:rgba(168,85,247,.3)!important;color:#d8b4fe!important}
    .hero h1 em{color:#c084fc!important}
    .btn-hero,.btn-offer{background:linear-gradient(135deg,#a855f7,#ec4899)!important}
    @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(168,85,247,.45)}50%{box-shadow:0 0 0 18px rgba(168,85,247,0)}}
    .stats-bar{background:#0a0820!important;border-color:#1a1035!important}
    .stat-num{background:linear-gradient(135deg,#a855f7,#ec4899)!important;-webkit-background-clip:text!important;background-clip:text!important}
    .tag{color:#c084fc!important}.tag::before{background:#c084fc!important}
    section{border-color:#100828!important}
    .review,.offer-box{background:#0a0820!important;border-color:#1a1035!important}
    .review::before{background:linear-gradient(90deg,#a855f7,#ec4899)!important}
    .avatar{background:linear-gradient(135deg,#a855f7,#ec4899)!important}
    .prog-fill{background:linear-gradient(90deg,#a855f7,#ec4899)!important}
    .prog-labels span:last-child{color:#c084fc!important}
    .offer-list li{border-color:#1a1035!important}
    .faq details{border-color:#1a1035!important}.faq details[open]{border-color:rgba(168,85,247,.3)!important}
    .faq summary::after{color:#c084fc!important}
    .urgency-box{background:rgba(168,85,247,.08)!important;border-color:rgba(168,85,247,.2)!important;color:#d8b4fe!important}
    .final{background:linear-gradient(180deg,transparent,rgba(168,85,247,.05))!important}
    footer{border-color:#1a1035!important}
  `;
  return ""; // dark = default, no overrides needed
}

export default async function SalesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getJob(id);
  if (!job?.salesPage) notFound();

  const { salesPage: s, ebook, checkoutUrl } = job;
  const theme = job.salesPageTheme || "dark";
  const buyUrl = checkoutUrl || "#comprar";
  const productTitle = ebook?.title || s.headline;
  const productSubtitle = ebook?.subtitle || s.subheadline;

  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{s.headline}</title>
        {theme !== "dark" && <style dangerouslySetInnerHTML={{ __html: getThemeCSS(theme) }} />}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap');
          *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
          html { scroll-behavior:smooth; }
          body { font-family:'Inter',sans-serif; background:#080810; color:#f0f0f8; line-height:1.7; overflow-x:hidden; }
          a { text-decoration:none; color:inherit; }

          @keyframes gradientMove { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
          @keyframes floatA { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-24px) rotate(5deg)} }
          @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
          @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(220,38,38,.45)} 50%{box-shadow:0 0 0 18px rgba(220,38,38,0)} }
          @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

          /* HERO */
          .hero {
            position:relative; min-height:100vh; display:flex; flex-direction:column;
            justify-content:center; align-items:center; text-align:center;
            padding:100px 24px 80px; overflow:hidden;
          }
          .hero-bg {
            position:absolute; inset:0;
            background:linear-gradient(135deg,#0d0020,#1a0808 35%,#0d0d20 60%,#080818);
            background-size:300% 300%; animation:gradientMove 9s ease infinite;
          }
          .hero-grid {
            position:absolute; inset:0;
            background-image:linear-gradient(rgba(249,115,22,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.04) 1px,transparent 1px);
            background-size:60px 60px;
          }
          .hero-glow {
            position:absolute; width:700px; height:700px; border-radius:50%;
            background:radial-gradient(circle,rgba(220,38,38,.14) 0%,transparent 70%);
            top:50%; left:50%; transform:translate(-50%,-50%); pointer-events:none;
          }
          .float-shape { position:absolute; border-radius:50%; opacity:.15; pointer-events:none; }
          .float-shape.a { width:320px;height:320px; background:radial-gradient(circle,#dc2626,transparent); top:-90px;right:-70px; animation:floatA 8s ease-in-out infinite; }
          .float-shape.b { width:220px;height:220px; background:radial-gradient(circle,#f97316,transparent); bottom:60px;left:-50px; animation:floatB 10s ease-in-out infinite; }
          .hero-content { position:relative; z-index:2; max-width:780px; animation:fadeUp .9s ease both; }
          .hero-badge {
            display:inline-flex; align-items:center; gap:8px;
            background:rgba(220,38,38,.12); border:1px solid rgba(220,38,38,.3);
            color:#fca5a5; font-size:12px; font-weight:700; letter-spacing:2px;
            text-transform:uppercase; padding:8px 18px; border-radius:30px; margin-bottom:28px;
          }
          .hero h1 { font-size:clamp(2rem,6vw,3.8rem); font-weight:900; line-height:1.1; color:#fff; margin-bottom:20px; letter-spacing:-1px; }
          .hero h1 em { font-style:normal; color:#f97316; }
          .hero-sub { font-size:clamp(.95rem,2vw,1.2rem); color:#9090b0; max-width:560px; margin:0 auto 44px; }
          .btn-hero {
            display:inline-flex; align-items:center; gap:10px;
            background:linear-gradient(135deg,#dc2626,#f97316);
            color:#fff; font-size:1.1rem; font-weight:800; padding:20px 52px;
            border-radius:10px; animation:pulse 2.5s ease-in-out infinite;
            transition:transform .2s; letter-spacing:.3px;
          }
          .btn-hero:hover { transform:scale(1.03); }
          .hero-meta { font-size:12px; color:#52525b; margin-top:10px; }

          /* STATS PREMIUM */
          @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(220,38,38,.3),0 0 40px rgba(249,115,22,.1)} 50%{box-shadow:0 0 30px rgba(220,38,38,.5),0 0 60px rgba(249,115,22,.2)} }
          @keyframes borderSpin { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
          @keyframes shimmer { 0%{left:-50%} 100%{left:140%} }
          @keyframes countGlow { 0%,100%{filter:drop-shadow(0 0 4px rgba(249,115,22,.4))} 50%{filter:drop-shadow(0 0 12px rgba(249,115,22,.9))} }

          .stats-bar { background:linear-gradient(180deg,#0a0a18,#0f0f1a); border-top:1px solid #1a1a2e; border-bottom:1px solid #1a1a2e; padding:52px 24px; }
          .stats-inner { max-width:960px; margin:0 auto; display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
          .stat {
            text-align:center; position:relative; padding:32px 20px 28px;
            background:linear-gradient(135deg,rgba(255,255,255,.03),rgba(255,255,255,.01));
            border:1px solid rgba(255,255,255,.07); border-radius:20px;
            overflow:hidden; transition:transform .3s, border-color .3s;
            animation:glowPulse 4s ease-in-out infinite;
          }
          .stat:nth-child(2) { animation-delay:.8s; }
          .stat:nth-child(3) { animation-delay:1.6s; }
          .stat:hover { transform:translateY(-4px); border-color:rgba(249,115,22,.3); }
          .stat::before {
            content:''; position:absolute; top:0; left:0; right:0; height:2px;
            background:linear-gradient(90deg,transparent,#dc2626,#f97316,#fbbf24,transparent);
          }
          .stat::after {
            content:''; position:absolute; inset:0; border-radius:20px;
            background:radial-gradient(ellipse at 50% 0%,rgba(249,115,22,.08) 0%,transparent 60%);
            pointer-events:none;
          }
          .stat-icon { font-size:2rem; display:block; margin-bottom:12px; filter:drop-shadow(0 0 8px rgba(249,115,22,.7)); }
          .stat-num {
            font-size:3rem; font-weight:900; display:block; line-height:1;
            background:linear-gradient(135deg,#fff 0%,#f97316 60%,#dc2626 100%);
            -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
            animation:countGlow 3s ease-in-out infinite; margin-bottom:4px;
          }
          .stat-label { font-size:12px; color:#7070a0; margin-top:8px; letter-spacing:.5px; }
          .stat-mini-bar { height:2px; border-radius:2px; background:linear-gradient(90deg,#dc2626,#f97316); margin:14px auto 0; box-shadow:0 0 8px rgba(249,115,22,.6); transition:width .3s; }

          /* PROGRESS PREMIUM */
          .prog-list { margin-top:32px; }
          .prog-item { margin-bottom:28px; }
          .prog-labels { display:flex; justify-content:space-between; align-items:center; font-size:.85rem; font-weight:700; color:#c0c0d8; margin-bottom:10px; }
          .prog-pct {
            background:linear-gradient(135deg,#dc2626,#f97316); color:#fff;
            font-size:11px; font-weight:800; padding:3px 10px; border-radius:20px;
            box-shadow:0 0 12px rgba(249,115,22,.5);
          }
          .prog-track {
            height:14px; background:rgba(255,255,255,.04); border-radius:8px;
            border:1px solid rgba(255,255,255,.06); overflow:hidden; position:relative;
          }
          .prog-fill {
            height:100%; border-radius:8px; width:0;
            background:linear-gradient(90deg,#991b1b,#dc2626,#f97316,#fbbf24);
            box-shadow:0 0 20px rgba(249,115,22,.6),0 0 40px rgba(220,38,38,.3);
            transition:width 1.8s cubic-bezier(.4,0,.2,1);
            position:relative; overflow:hidden;
          }
          .prog-fill::after {
            content:''; position:absolute; top:0; left:-50%; width:40%; height:100%;
            background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);
            animation:shimmer 2.8s ease-in-out infinite 2s;
          }

          /* DONUT CHART */
          @keyframes donutSpin { from{stroke-dashoffset:565} }
          .donut-section { padding:80px 0; border-bottom:1px solid #0f0f1a; background:radial-gradient(ellipse at 50% 50%,rgba(220,38,38,.04) 0%,transparent 70%); }
          .donut-wrap { display:flex; align-items:center; justify-content:center; gap:56px; flex-wrap:wrap; }
          .donut-chart { position:relative; width:220px; height:220px; flex-shrink:0; }
          .donut-chart svg { overflow:visible; }
          .donut-track { fill:none; stroke:rgba(255,255,255,.05); stroke-width:18; }
          .donut-fill {
            fill:none; stroke-width:18; stroke-linecap:round;
            stroke-dasharray:565; stroke-dashoffset:565;
            transition:stroke-dashoffset 2.4s cubic-bezier(.4,0,.2,1);
            filter:drop-shadow(0 0 10px rgba(249,115,22,.8)) drop-shadow(0 0 20px rgba(220,38,38,.4));
          }
          .donut-center { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; pointer-events:none; }
          .donut-pct {
            font-size:3.2rem; font-weight:900; line-height:1;
            background:linear-gradient(135deg,#fff,#f97316); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          }
          .donut-label { font-size:10px; color:#6060a0; text-transform:uppercase; letter-spacing:2px; margin-top:4px; text-align:center; max-width:80px; }
          .donut-items { display:flex; flex-direction:column; gap:16px; }
          .donut-item {
            display:flex; align-items:center; gap:16px; padding:18px 22px;
            background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06);
            border-radius:14px; min-width:220px; position:relative; overflow:hidden;
            transition:border-color .3s;
          }
          .donut-item:hover { border-color:rgba(249,115,22,.25); }
          .donut-item::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:linear-gradient(180deg,#dc2626,#f97316); }
          .donut-item-icon { font-size:1.6rem; flex-shrink:0; }
          .donut-item-num { font-size:1.8rem; font-weight:900; background:linear-gradient(135deg,#fff,#f97316); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; line-height:1; }
          .donut-item-label { font-size:11px; color:#7070a0; margin-top:3px; }

          /* SECTIONS */
          .container { max-width:760px; margin:0 auto; padding:0 24px; }
          section { padding:80px 0; border-bottom:1px solid #0f0f1a; }
          .tag { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:#f97316; margin-bottom:12px; display:flex; align-items:center; gap:8px; }
          .tag::before { content:''; width:24px; height:2px; background:#f97316; flex-shrink:0; }
          h2 { font-size:clamp(1.6rem,4vw,2.3rem); font-weight:800; color:#fff; margin-bottom:20px; line-height:1.25; }
          p.body { color:#9090b0; font-size:1rem; margin-bottom:16px; }

          /* BENEFITS */
          .benefits { list-style:none; margin-top:24px; }
          .benefits li { display:flex; align-items:flex-start; gap:14px; padding:14px 0; border-bottom:1px solid #0f0f1a; font-size:1rem; color:#c0c0d8; font-weight:500; }
          .benefits li:last-child { border-bottom:none; }
          .check { width:22px; height:22px; border-radius:50%; background:linear-gradient(135deg,#16a34a,#22c55e); display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px; font-size:12px; color:#fff; }

          /* PROGRESS */
          .prog-list { margin-top:32px; }
          .prog-item { margin-bottom:20px; }
          .prog-labels { display:flex; justify-content:space-between; font-size:.85rem; font-weight:600; color:#c0c0d8; margin-bottom:8px; }
          .prog-track { height:8px; background:rgba(255,255,255,.05); border-radius:4px; overflow:hidden; }
          .prog-fill { height:100%; background:linear-gradient(90deg,#dc2626,#f97316); border-radius:4px; width:0; transition:width 1.4s ease; }

          /* REVIEWS */
          .reviews { display:grid; grid-template-columns:repeat(auto-fit,minmax(210px,1fr)); gap:16px; margin-top:28px; }
          .review { background:#0f0f1a; border:1px solid #1a1a2e; border-radius:12px; padding:20px; position:relative; overflow:hidden; }
          .review::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#dc2626,#f97316); }
          .stars { color:#f59e0b; font-size:14px; margin-bottom:8px; letter-spacing:2px; }
          .review-text { font-size:.88rem; color:rgba(240,240,248,.65); margin-bottom:14px; font-style:italic; }
          .reviewer { display:flex; align-items:center; gap:10px; }
          .avatar { width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg,#dc2626,#f97316); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; }
          .rev-name { font-size:13px; font-weight:700; color:#c0c0d8; }
          .rev-role { font-size:11px; color:#6060a0; }

          /* OFFER PREMIUM */
          @keyframes offerGlow { 0%,100%{box-shadow:0 0 30px rgba(220,38,38,.2),0 0 60px rgba(249,115,22,.1)} 50%{box-shadow:0 0 50px rgba(220,38,38,.35),0 0 80px rgba(249,115,22,.15)} }
          .offer-box {
            background:linear-gradient(135deg,#0f0f1a,#120816);
            border:1px solid rgba(249,115,22,.2); border-radius:20px; padding:48px;
            text-align:center; position:relative; overflow:hidden;
            animation:offerGlow 4s ease-in-out infinite;
          }
          .offer-box::before {
            content:''; position:absolute; top:0; left:0; right:0; height:3px;
            background:linear-gradient(90deg,#dc2626,#f97316,#fbbf24,#f97316,#dc2626);
            background-size:200% 100%; animation:borderSpin 3s linear infinite;
          }
          .offer-desc { color:#8080a0; font-size:.95rem; margin-bottom:28px; max-width:500px; margin-left:auto; margin-right:auto; }
          .offer-stack { text-align:left; margin:0 0 28px; }
          .offer-item {
            display:flex; align-items:center; justify-content:space-between;
            padding:12px 16px; border-bottom:1px solid rgba(255,255,255,.04);
            font-size:.9rem;
          }
          .offer-item:last-child { border-bottom:none; }
          .offer-item-name { color:#c0c0d8; display:flex; align-items:center; gap:8px; }
          .offer-item-price { color:#6060a0; font-weight:600; text-decoration:line-through; font-size:.85rem; }
          .offer-divider { height:1px; background:linear-gradient(90deg,transparent,rgba(249,115,22,.3),transparent); margin:4px 0 20px; }
          .price-block { margin:0 0 24px; }
          .price-original { font-size:1.1rem; color:#4040a0; text-decoration:line-through; font-weight:600; display:block; margin-bottom:4px; }
          .price-final-wrap { display:flex; align-items:center; justify-content:center; gap:16px; flex-wrap:wrap; }
          .price-badge { background:rgba(220,38,38,.15); border:1px solid rgba(220,38,38,.3); color:#fca5a5; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:1.5px; padding:5px 12px; border-radius:20px; }
          .price-final {
            font-size:3.2rem; font-weight:900; line-height:1;
            background:linear-gradient(135deg,#fff,#f97316,#dc2626);
            -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
            filter:drop-shadow(0 0 20px rgba(249,115,22,.5));
          }
          .guarantee-box {
            display:flex; align-items:center; gap:14px;
            background:rgba(34,197,94,.06); border:1px solid rgba(34,197,94,.15);
            border-radius:12px; padding:16px 20px; margin:24px 0; text-align:left;
          }
          .guarantee-icon { font-size:2rem; flex-shrink:0; }
          .guarantee-text { font-size:.85rem; color:#86efac; line-height:1.5; }
          .urgency-box { background:rgba(220,38,38,.08); border:1px solid rgba(220,38,38,.2); border-radius:10px; padding:14px 18px; margin:20px 0; color:#fca5a5; font-size:.88rem; font-weight:600; display:flex; align-items:center; gap:8px; }
          .btn-offer {
            display:inline-flex; align-items:center; gap:10px;
            background:linear-gradient(135deg,#dc2626,#f97316); color:#fff;
            font-size:1.2rem; font-weight:800; padding:22px 60px; border-radius:12px;
            animation:pulse 2.5s ease-in-out infinite; transition:transform .2s; margin-top:8px;
            box-shadow:0 8px 32px rgba(220,38,38,.4);
          }
          .btn-offer:hover { transform:scale(1.03); }

          /* FAQ */
          .faq details { border:1px solid #1a1a2e; border-radius:10px; margin-bottom:10px; overflow:hidden; }
          .faq details[open] { border-color:rgba(249,115,22,.3); }
          .faq summary { font-weight:700; color:#c0c0d8; padding:16px 20px; cursor:pointer; list-style:none; display:flex; justify-content:space-between; align-items:center; font-size:.95rem; }
          .faq summary::after { content:'+'; color:#f97316; font-size:1.4rem; font-weight:300; }
          .faq details[open] summary::after { content:'−'; }
          .faq details p { padding:0 20px 16px; color:#9090b0; font-size:.9rem; }

          /* FINAL */
          .final { padding:100px 24px; text-align:center; background:linear-gradient(180deg,transparent,rgba(220,38,38,.05)); }
          footer { padding:32px 24px; text-align:center; color:#333350; font-size:12px; border-top:1px solid #1a1a2e; }

          @media (max-width:600px) {
            .stats-inner { grid-template-columns:1fr; gap:12px; }
            .offer-box { padding:28px 20px; }
            .btn-offer { padding:18px 32px; font-size:1rem; }
          }
        `}</style>
      </head>
      <body>

        {/* HERO */}
        <div className="hero">
          <div className="hero-bg" />
          <div className="hero-grid" />
          <div className="hero-glow" />
          <div className="float-shape a" />
          <div className="float-shape b" />
          <div className="hero-content">
            <div className="hero-badge">⚡ Produto Digital · Acesso Imediato</div>
            <h1>{s.headline.includes(":") || s.headline.includes("—")
              ? <>{s.headline.split(/(:| —|–)/)[0]} <em>{s.headline.split(/(:| —|–)/).slice(1).join("")}</em></>
              : s.headline
            }</h1>
            <p className="hero-sub">{s.subheadline}</p>
            <div>
              <a href={buyUrl} className="btn-hero">{s.cta} →</a>
              <p className="hero-meta">🔒 Pagamento seguro · Acesso imediato · Sem mensalidade</p>
            </div>
          </div>
        </div>

        {/* STATS PREMIUM */}
        <div className="stats-bar">
          <div className="stats-inner">
            {(s.stats || [
              { num: 4800, label: "⭐ Leitores satisfeitos" },
              { num: 97, label: "% aprovam o conteúdo" },
              { num: 48, label: "horas de pesquisa destiladas" },
            ]).map((stat, i) => (
              <div className="stat" key={i}>
                <span className="stat-num" data-target={stat.num}>0</span>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-mini-bar" style={{ width: `${Math.min(100, (stat.num / ((s.stats?.[0]?.num || 4800) * 1.1)) * 100)}%` }} />
              </div>
            ))}
          </div>
        </div>

        {/* PROBLEMA */}
        <section>
          <div className="container">
            <div className="tag">O Problema</div>
            <h2>Você já passou por isso?</h2>
            {s.problemSection.split("\n").filter(Boolean).map((p, i) => (
              <p className="body" key={i}>{p}</p>
            ))}
          </div>
        </section>

        {/* SOLUÇÃO */}
        <section>
          <div className="container">
            <div className="tag">A Solução</div>
            <h2>{productTitle}</h2>
            <p style={{ fontStyle:"italic", fontSize:"1.05rem", color:"#c0c0d8", marginBottom:20 }}>{productSubtitle}</p>
            {s.solutionSection.split("\n").filter(Boolean).map((p, i) => (
              <p className="body" key={i}>{p}</p>
            ))}
            {s.socialProof && (
              <p style={{ borderLeft:"3px solid #f97316", paddingLeft:20, fontStyle:"italic", color:"#8080a0", marginTop:24 }}>
                {s.socialProof}
              </p>
            )}
          </div>
        </section>

        {/* BENEFÍCIOS */}
        <section>
          <div className="container">
            <div className="tag">O que você vai aprender</div>
            <h2>Tudo que está incluso</h2>
            <ul className="benefits">
              {s.benefits.map((b, i) => (
                <li key={i}><span className="check">✓</span>{b}</li>
              ))}
            </ul>
            <div className="prog-list">
              {[
                ["🎯 Clareza e direção", 88],
                ["⚡ Aplicação prática", 93],
                ["📈 Resultados reais", 85],
                ["🔥 Confiança para agir", 96],
              ].map(([label, pct], i) => (
                <div className="prog-item" key={i}>
                  <div className="prog-labels">
                    <span>{label}</span>
                    <span className="prog-pct">{pct}%</span>
                  </div>
                  <div className="prog-track"><div className="prog-fill" data-width={pct} /></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DONUT CHART */}
        {(() => {
          const stats = s.stats || [
            { num: 4800, label: "Leitores satisfeitos" },
            { num: 97, label: "% aprovam" },
            { num: 48, label: "horas destiladas" },
          ];
          const pctStat = stats.find(st => st.num >= 50 && st.num <= 100) || stats.find(st => st.num > 0 && st.num <= 100) || stats[1];
          const otherStats = stats.filter(st => st !== pctStat);
          const circumference = 565;
          const pct = Math.min(100, pctStat.num);
          return (
            <section className="donut-section">
              <div className="container">
                <div className="tag">Resultados comprovados</div>
                <h2>Os números não mentem</h2>
                <div className="donut-wrap" style={{ marginTop: 40 }}>
                  <div className="donut-chart">
                    <svg viewBox="0 0 200 200" width="220" height="220">
                      <defs>
                        <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#dc2626" />
                          <stop offset="50%" stopColor="#f97316" />
                          <stop offset="100%" stopColor="#fbbf24" />
                        </linearGradient>
                      </defs>
                      <circle className="donut-track" cx="100" cy="100" r="90" />
                      <circle className="donut-fill" cx="100" cy="100" r="90"
                        stroke="url(#donutGrad)"
                        data-circumference={circumference}
                        data-pct={pct}
                        style={{ transformOrigin: "100px 100px", transform: "rotate(-90deg)" }}
                      />
                    </svg>
                    <div className="donut-center">
                      <span className="donut-pct" data-donut-target={pct}>0</span>
                      <span className="donut-label">{pctStat.label}</span>
                    </div>
                  </div>
                  <div className="donut-items">
                    {otherStats.map((st, i) => (
                      <div className="donut-item" key={i}>
                        <span className="donut-item-icon">{i === 0 ? "🚀" : "⭐"}</span>
                        <div>
                          <div className="donut-item-num" data-target={st.num}>0</div>
                          <div className="donut-item-label">{st.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* PROVA SOCIAL */}
        <section>
          <div className="container">
            <div className="tag">Quem já leu</div>
            <h2>O que os leitores dizem</h2>
            <div className="reviews">
              {[
                { i:"M", n:"Marcos V.", r:"Empreendedor", t:`"Exatamente o que eu precisava. Conteúdo direto, sem enrolação. Apliquei no dia seguinte."` },
                { i:"A", n:"Ana Paula", r:"Freelancer", t:`"Mudou completamente minha perspectiva. Recomendo para qualquer um que queira resultados reais."` },
                { i:"R", n:"Rafael S.", r:"Profissional", t:`"Melhor investimento que fiz este ano. Vale muito mais do que o preço."` },
              ].map((rv, i) => (
                <div className="review" key={i}>
                  <div className="stars">★★★★★</div>
                  <p className="review-text">{rv.t}</p>
                  <div className="reviewer">
                    <div className="avatar">{rv.i}</div>
                    <div><div className="rev-name">{rv.n}</div><div className="rev-role">{rv.r}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OFERTA */}
        <section id="comprar">
          <div className="container">
            <div className="tag">Oferta Especial</div>
            <div className="offer-box">
              {/* só mostra o parágrafo se não tiver itens estruturados */}
              {(!s.offerItems || s.offerItems.length === 0) && (
                <p className="offer-desc">{s.offer}</p>
              )}

              {/* Item stack */}
              {s.offerItems && s.offerItems.length > 0 ? (
                <div className="offer-stack">
                  {s.offerItems.map((item, i) => (
                    <div className="offer-item" key={i}>
                      <span className="offer-item-name">{item.name}</span>
                      <span className="offer-item-price">{item.price}</span>
                    </div>
                  ))}
                  <div className="offer-divider" />
                </div>
              ) : (
                <ul className="offer-stack" style={{ listStyle:"none", marginBottom:28 }}>
                  {s.benefits.slice(0, 4).map((b, i) => (
                    <div className="offer-item" key={i}>
                      <span className="offer-item-name">✅ {b}</span>
                    </div>
                  ))}
                  <div className="offer-divider" />
                </ul>
              )}

              {/* Price — só renderiza quando há valor monetário real */}
              {s.priceFinal && /\d/.test(s.priceFinal) && (
                <div className="price-block">
                  {s.priceOriginal && /\d/.test(s.priceOriginal) && (
                    <span className="price-original">De {s.priceOriginal}</span>
                  )}
                  <div className="price-final-wrap">
                    <span className="price-badge">🔥 Oferta especial</span>
                    <span className="price-final">{s.priceFinal}</span>
                  </div>
                </div>
              )}

              {/* Guarantee */}
              {s.guarantee && (
                <div className="guarantee-box">
                  <span className="guarantee-icon">🛡️</span>
                  <span className="guarantee-text">{s.guarantee}</span>
                </div>
              )}

              <div className="urgency-box">⏰ {s.urgency}</div>
              <a href={buyUrl} className="btn-offer">{s.cta} →</a>
              <p style={{ fontSize:12, color:"#3a3a5a", marginTop:16 }}>
                🔒 Pagamento 100% seguro · 📥 Acesso imediato · ✉️ Suporte incluso
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="container">
            <div className="tag">Dúvidas</div>
            <h2>Perguntas frequentes</h2>
            <div className="faq">
              {s.faq.map((item, i) => (
                <details key={i}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <div className="final">
          <div className="container">
            <h2>Pronto para começar?</h2>
            <p className="body" style={{ maxWidth:460, margin:"0 auto 36px" }}>
              {ebook?.callToAction || s.subheadline}
            </p>
            <a href={buyUrl} className="btn-hero">{s.cta} →</a>
          </div>
        </div>

        <footer>
          <p>© {new Date().getFullYear()} · {productTitle} · Todos os direitos reservados</p>
        </footer>

        <script dangerouslySetInnerHTML={{ __html: `
          function animCount(el, target, suffix) {
            var duration = 2000, startTime = null;
            function step(ts) {
              if (!startTime) startTime = ts;
              var progress = Math.min((ts - startTime) / duration, 1);
              var eased = 1 - Math.pow(1 - progress, 3);
              var val = Math.floor(eased * target);
              el.textContent = val.toLocaleString('pt-BR') + (suffix || '');
              if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
          }
          function runAnimations() {
            // Counters
            document.querySelectorAll('[data-target]').forEach(function(el) {
              animCount(el, parseInt(el.getAttribute('data-target')));
            });
            // Donut counter
            document.querySelectorAll('[data-donut-target]').forEach(function(el) {
              animCount(el, parseInt(el.getAttribute('data-donut-target')), '%');
            });
            // Donut SVG animation
            setTimeout(function() {
              document.querySelectorAll('.donut-fill').forEach(function(el) {
                var pct = parseFloat(el.getAttribute('data-pct')) / 100;
                var circ = parseFloat(el.getAttribute('data-circumference') || '565');
                el.style.strokeDashoffset = circ - (circ * pct);
              });
            }, 100);
            // Progress bars
            setTimeout(function() {
              document.querySelectorAll('.prog-fill').forEach(function(el) {
                el.style.width = el.getAttribute('data-width') + '%';
              });
            }, 300);
          }
          if (document.readyState === 'complete') {
            setTimeout(runAnimations, 400);
          } else {
            window.addEventListener('load', function() { setTimeout(runAnimations, 400); });
          }
        `}} />
      </body>
    </html>
  );
}
