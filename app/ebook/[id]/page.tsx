import { notFound } from "next/navigation";
import { getJob } from "@/lib/jobs";

export default async function EbookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getJob(id);
  if (!job?.ebook) notFound();

  const { ebook } = job;
  const pdfUrl = `/api/ebook-pdf/${id}`;

  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{ebook.title} — Ebook</title>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Inter:wght@400;500;600;700;800&display=swap');
          * { margin:0; padding:0; box-sizing:border-box; }
          :root {
            --bg: #0c0c14;
            --surface: #13131f;
            --border: #1e1e30;
            --text: #e8e8f0;
            --muted: #8888a8;
            --accent: #f97316;
            --accent2: #dc2626;
            --sidebar-w: 280px;
          }
          body { font-family:'Merriweather',serif; background:var(--bg); color:var(--text); min-height:100vh; }

          /* Sidebar */
          .sidebar {
            position:fixed; left:0; top:0; bottom:0; width:var(--sidebar-w);
            background:var(--surface); border-right:1px solid var(--border);
            overflow-y:auto; padding:24px 0; z-index:100;
            display:flex; flex-direction:column;
          }
          .sidebar-brand {
            padding:0 24px 24px; border-bottom:1px solid var(--border); margin-bottom:16px;
          }
          .sidebar-brand .tag { font-family:'Inter',sans-serif; font-size:10px; font-weight:700;
            text-transform:uppercase; letter-spacing:2px; color:var(--accent); margin-bottom:8px; }
          .sidebar-brand h2 { font-size:14px; font-weight:700; font-family:'Inter',sans-serif;
            color:var(--text); line-height:1.4; }
          .toc-label { padding:0 24px; font-family:'Inter',sans-serif; font-size:10px;
            font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:var(--muted); margin-bottom:8px; }
          .toc-item {
            display:flex; align-items:center; gap:10px;
            padding:10px 24px; cursor:pointer; transition:all .2s;
            font-family:'Inter',sans-serif; font-size:13px; color:var(--muted);
            border-left:3px solid transparent; text-decoration:none;
          }
          .toc-item:hover { color:var(--text); background:rgba(255,255,255,0.03); }
          .toc-item.active { color:var(--accent); border-left-color:var(--accent); background:rgba(249,115,22,0.08); }
          .toc-item .num { width:22px; height:22px; rounded:4px; background:rgba(255,255,255,0.05);
            border-radius:4px; display:flex; align-items:center; justify-content:center;
            font-size:11px; font-weight:700; flex-shrink:0; }
          .toc-item.active .num { background:var(--accent); color:#fff; }
          .sidebar-footer { margin-top:auto; padding:16px 24px; border-top:1px solid var(--border); }
          .btn-pdf {
            display:flex; align-items:center; justify-content:center; gap:8px;
            width:100%; padding:10px 16px; background:linear-gradient(135deg,var(--accent2),var(--accent));
            color:#fff; font-family:'Inter',sans-serif; font-size:13px; font-weight:700;
            border:none; border-radius:8px; cursor:pointer; text-decoration:none;
            transition:opacity .2s;
          }
          .btn-pdf:hover { opacity:.9; }
          .btn-print {
            display:flex; align-items:center; justify-content:center; gap:8px;
            width:100%; padding:10px 16px; background:rgba(255,255,255,0.06);
            border:1px solid rgba(255,255,255,0.1); color:var(--muted);
            font-family:'Inter',sans-serif; font-size:13px; font-weight:600;
            border-radius:8px; cursor:pointer; transition:all .2s; margin-top:8px;
          }
          .btn-print:hover { color:var(--text); background:rgba(255,255,255,0.1); }

          /* Main content */
          .main { margin-left:var(--sidebar-w); }
          .content { max-width:720px; margin:0 auto; padding:60px 48px 120px; }

          /* Cover */
          #cover {
            min-height:90vh; display:flex; flex-direction:column; justify-content:center;
            position:relative; overflow:hidden; padding:80px 0 60px;
          }
          .cover-bg {
            position:absolute; inset:0;
            background:radial-gradient(ellipse at 30% 50%, rgba(220,38,38,0.12) 0%, transparent 60%),
                        radial-gradient(ellipse at 70% 20%, rgba(249,115,22,0.08) 0%, transparent 50%);
            pointer-events:none;
          }
          .cover-badge {
            display:inline-flex; align-items:center; gap:6px;
            background:rgba(249,115,22,0.12); border:1px solid rgba(249,115,22,0.25);
            color:var(--accent); font-family:'Inter',sans-serif; font-size:11px;
            font-weight:700; text-transform:uppercase; letter-spacing:2px;
            padding:6px 14px; border-radius:20px; margin-bottom:32px; width:fit-content;
          }
          .cover-title {
            font-size:clamp(2rem,4vw,3rem); font-weight:700; line-height:1.15;
            color:#fff; margin-bottom:16px; position:relative;
          }
          .cover-title span { color:var(--accent); }
          .cover-subtitle {
            font-size:1.1rem; color:var(--muted); font-style:italic;
            margin-bottom:40px; max-width:560px; line-height:1.7;
          }
          .cover-author {
            font-family:'Inter',sans-serif; font-size:13px; color:var(--muted);
            text-transform:uppercase; letter-spacing:2px;
          }
          .cover-divider {
            width:60px; height:3px;
            background:linear-gradient(90deg,var(--accent2),var(--accent));
            border-radius:2px; margin:32px 0;
          }
          .cover-desc {
            font-size:1rem; line-height:1.8; color:rgba(232,232,240,0.7);
            max-width:560px;
          }

          /* Chapter */
          .chapter { padding-top:80px; }
          .chapter-header { margin-bottom:40px; }
          .chapter-num {
            font-family:'Inter',sans-serif; font-size:11px; font-weight:700;
            text-transform:uppercase; letter-spacing:2px; color:var(--accent);
            margin-bottom:12px; display:flex; align-items:center; gap:8px;
          }
          .chapter-num::after { content:''; flex:1; height:1px; background:rgba(249,115,22,0.2); max-width:80px; }
          .chapter-title { font-size:clamp(1.5rem,3vw,2rem); font-weight:700; color:#fff; line-height:1.3; }
          .chapter-content { font-size:1.05rem; line-height:1.9; color:rgba(232,232,240,0.8); }
          .chapter-content p { margin-bottom:1.4em; }
          blockquote {
            border-left:3px solid var(--accent); padding:16px 24px;
            background:rgba(249,115,22,0.05); border-radius:0 8px 8px 0;
            margin:32px 0; font-style:italic; color:rgba(232,232,240,0.7); font-size:1rem;
          }
          .key-points {
            background:var(--surface); border:1px solid var(--border);
            border-radius:12px; padding:24px; margin:32px 0;
          }
          .key-points-label {
            font-family:'Inter',sans-serif; font-size:10px; font-weight:700;
            text-transform:uppercase; letter-spacing:2px; color:var(--muted); margin-bottom:16px;
          }
          .key-point {
            display:flex; align-items:flex-start; gap:10px;
            font-family:'Inter',sans-serif; font-size:0.9rem; color:rgba(232,232,240,0.8);
            margin-bottom:10px; line-height:1.5;
          }
          .key-point::before { content:'→'; color:var(--accent); flex-shrink:0; font-weight:700; }
          .chapter-divider { width:40px; height:2px; background:var(--border); margin:64px 0 0; border-radius:2px; }

          /* Conclusion */
          #conclusion {
            padding-top:80px;
            background:linear-gradient(135deg,rgba(220,38,38,0.06),rgba(249,115,22,0.06));
            border:1px solid rgba(249,115,22,0.15); border-radius:16px;
            padding:48px; margin-top:80px;
          }
          .conclusion-label {
            font-family:'Inter',sans-serif; font-size:11px; font-weight:700;
            text-transform:uppercase; letter-spacing:2px; color:var(--accent); margin-bottom:16px;
          }
          .conclusion-title { font-size:1.5rem; font-weight:700; color:#fff; margin-bottom:20px; }
          .conclusion-text { font-size:1rem; line-height:1.8; color:rgba(232,232,240,0.75); margin-bottom:24px; }
          .cta-text { font-size:1.05rem; font-weight:700; color:var(--accent); font-family:'Inter',sans-serif; }

          /* Print styles */
          @media print {
            .sidebar, .cover-bg { display:none; }
            .main { margin-left:0; }
            .content { padding:40px; max-width:100%; }
            body { background:#fff; color:#000; }
            .chapter-content { color:#333; }
            .cover-title { color:#000; }
            .chapter-title { color:#000; }
            blockquote { border-color:#f97316; }
            .key-points { background:#f9f9f9; border-color:#ddd; }
            #conclusion { background:#fff9f5; border-color:#f97316; }
            a { display:none; }
            @page { margin: 2cm; }
          }

          /* Mobile */
          @media (max-width: 768px) {
            .sidebar { display:none; }
            .main { margin-left:0; }
            .content { padding:40px 24px 80px; }
            .mobile-header {
              display:flex!important; position:sticky; top:0; z-index:50;
              background:var(--surface); border-bottom:1px solid var(--border);
              padding:12px 16px; align-items:center; justify-content:space-between;
            }
          }
          .mobile-header { display:none; }

          html { scroll-behavior:smooth; }
        `}</style>
      </head>
      <body>
        <nav className="sidebar">
          <div className="sidebar-brand">
            <div className="tag">📖 Ebook Digital</div>
            <h2>{ebook.title}</h2>
          </div>
          <div className="toc-label">Conteúdo</div>
          <a className="toc-item active" href="#cover">
            <span className="num">✦</span> Capa
          </a>
          {ebook.chapters.map((ch, i) => (
            <a key={i} className="toc-item" href={`#cap-${i}`}>
              <span className="num">{i + 1}</span>
              <span style={{ lineHeight: "1.3" }}>{ch.title}</span>
            </a>
          ))}
          <a className="toc-item" href="#conclusion">
            <span className="num">★</span> Conclusão
          </a>
          <div className="sidebar-footer">
            <a className="btn-pdf" href={pdfUrl} target="_blank" rel="noopener noreferrer">
              ⬇ Baixar PDF
            </a>
            <button className="btn-print" onClick={() => window.print()}>
              🖨 Imprimir
            </button>
          </div>
        </nav>

        <div className="mobile-header">
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 14 }}>{ebook.title}</span>
          <a className="btn-pdf" href={pdfUrl} style={{ width: "auto", padding: "8px 14px", fontSize: 12 }} target="_blank">⬇ PDF</a>
        </div>

        <main className="main">
          <div className="content">
            {/* Cover */}
            <section id="cover">
              <div className="cover-bg" />
              <div className="cover-badge">📖 Ebook Digital</div>
              <h1 className="cover-title"
                dangerouslySetInnerHTML={{ __html: ebook.title.replace(/(:.*|—.*|–.*)/, '<br/><span>$1</span>') }}
              />
              <p className="cover-subtitle">{ebook.subtitle}</p>
              <div className="cover-author">por {ebook.author || "Autor"}</div>
              <div className="cover-divider" />
              <p className="cover-desc">{ebook.description}</p>
            </section>

            {/* Chapters */}
            {ebook.chapters.map((chapter, i) => (
              <section key={i} id={`cap-${i}`} className="chapter">
                <div className="chapter-header">
                  <div className="chapter-num">Capítulo {i + 1}</div>
                  <h2 className="chapter-title">{chapter.title}</h2>
                </div>
                <div className="chapter-content">
                  {chapter.content.split("\n").filter(Boolean).map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
                {chapter.quote && (
                  <blockquote>&ldquo;{chapter.quote}&rdquo;</blockquote>
                )}
                {chapter.keyPoints?.length > 0 && (
                  <div className="key-points">
                    <div className="key-points-label">Pontos-chave deste capítulo</div>
                    {chapter.keyPoints.map((point, j) => (
                      <div key={j} className="key-point">{point}</div>
                    ))}
                  </div>
                )}
                {i < ebook.chapters.length - 1 && <div className="chapter-divider" />}
              </section>
            ))}

            {/* Conclusion */}
            <div id="conclusion">
              <div className="conclusion-label">Conclusão</div>
              <h3 className="conclusion-title">Próximos Passos</h3>
              <p className="conclusion-text">{ebook.conclusion}</p>
              <p className="cta-text">{ebook.callToAction}</p>
            </div>
          </div>
        </main>

        <script dangerouslySetInnerHTML={{ __html: `
          // Highlight active TOC item on scroll
          const sections = document.querySelectorAll('[id]');
          const tocLinks = document.querySelectorAll('.toc-item');
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                tocLinks.forEach(l => l.classList.remove('active'));
                const active = document.querySelector('.toc-item[href="#' + entry.target.id + '"]');
                if (active) active.classList.add('active');
              }
            });
          }, { threshold: 0.3 });
          sections.forEach(s => observer.observe(s));
        `}} />
      </body>
    </html>
  );
}
