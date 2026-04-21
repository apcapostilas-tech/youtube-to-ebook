import { notFound } from "next/navigation";
import { getJob } from "@/lib/jobs";

export default async function EbookPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ print?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const autoPrint = sp?.print === "1";
  const job = getJob(id);
  if (!job?.ebook) notFound();

  const { ebook } = job;

  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{ebook.title}</title>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Inter:wght@400;500;600;700;800&display=swap');
          *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
          :root {
            --bg:#0c0c14; --surface:#13131f; --border:#1e1e30;
            --text:#e8e8f0; --muted:#8888a8; --accent:#f97316; --red:#dc2626;
            --sidebar-w:280px;
          }
          body { font-family:'Merriweather',serif; background:var(--bg); color:var(--text); min-height:100vh; }
          a { color:inherit; text-decoration:none; }

          .sidebar {
            position:fixed; left:0; top:0; bottom:0; width:var(--sidebar-w);
            background:var(--surface); border-right:1px solid var(--border);
            overflow-y:auto; padding:24px 0; z-index:100; display:flex; flex-direction:column;
          }
          .sidebar-brand { padding:0 24px 24px; border-bottom:1px solid var(--border); margin-bottom:16px; }
          .sidebar-tag { font-family:'Inter',sans-serif; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:var(--accent); margin-bottom:8px; }
          .sidebar-title { font-size:13px; font-weight:700; font-family:'Inter',sans-serif; color:var(--text); line-height:1.4; }
          .toc-label { padding:0 24px; font-family:'Inter',sans-serif; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:var(--muted); margin-bottom:8px; }
          .toc-item { display:flex; align-items:center; gap:10px; padding:10px 24px; font-family:'Inter',sans-serif; font-size:13px; color:var(--muted); border-left:3px solid transparent; transition:all .2s; cursor:pointer; }
          .toc-item:hover { color:var(--text); background:rgba(255,255,255,.03); }
          .toc-num { width:22px; height:22px; background:rgba(255,255,255,.05); border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; flex-shrink:0; }
          .sidebar-footer { margin-top:auto; padding:16px 24px; border-top:1px solid var(--border); display:flex; flex-direction:column; gap:8px; }
          .btn-pdf { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:10px 16px; background:linear-gradient(135deg,var(--red),var(--accent)); color:#fff; font-family:'Inter',sans-serif; font-size:13px; font-weight:700; border:none; border-radius:8px; cursor:pointer; text-decoration:none; transition:opacity .2s; }
          .btn-pdf:hover { opacity:.9; }
          .btn-print { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:10px 16px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); color:var(--muted); font-family:'Inter',sans-serif; font-size:13px; font-weight:600; border-radius:8px; cursor:pointer; transition:all .2s; }
          .btn-print:hover { color:var(--text); background:rgba(255,255,255,.1); }

          .main { margin-left:var(--sidebar-w); }
          .content { max-width:720px; margin:0 auto; padding:60px 48px 120px; }

          #cover { min-height:90vh; display:flex; flex-direction:column; justify-content:center; position:relative; overflow:hidden; padding:80px 0 60px; }
          .cover-bg { position:absolute; inset:0; background:radial-gradient(ellipse at 30% 50%, rgba(220,38,38,.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(249,115,22,.08) 0%, transparent 50%); pointer-events:none; }
          .cover-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(249,115,22,.12); border:1px solid rgba(249,115,22,.25); color:var(--accent); font-family:'Inter',sans-serif; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:2px; padding:6px 14px; border-radius:20px; margin-bottom:32px; width:fit-content; }
          .cover-title { font-size:clamp(2rem,4vw,3rem); font-weight:700; line-height:1.15; color:#fff; margin-bottom:16px; position:relative; }
          .cover-subtitle { font-size:1.1rem; color:var(--muted); font-style:italic; margin-bottom:40px; max-width:560px; line-height:1.7; }
          .cover-author { font-family:'Inter',sans-serif; font-size:13px; color:var(--muted); text-transform:uppercase; letter-spacing:2px; }
          .cover-divider { width:60px; height:3px; background:linear-gradient(90deg,var(--red),var(--accent)); border-radius:2px; margin:32px 0; }
          .cover-desc { font-size:1rem; line-height:1.8; color:rgba(232,232,240,.7); max-width:560px; }

          .chapter { padding-top:80px; }
          .chapter-num { font-family:'Inter',sans-serif; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:var(--accent); margin-bottom:12px; display:flex; align-items:center; gap:8px; }
          .chapter-num::after { content:''; flex:1; height:1px; background:rgba(249,115,22,.2); max-width:80px; }
          .chapter-title { font-size:clamp(1.5rem,3vw,2rem); font-weight:700; color:#fff; line-height:1.3; margin-bottom:32px; }
          .chapter-content p { font-size:1.05rem; line-height:1.9; color:rgba(232,232,240,.8); margin-bottom:1.4em; }
          blockquote { border-left:3px solid var(--accent); padding:16px 24px; background:rgba(249,115,22,.05); border-radius:0 8px 8px 0; margin:32px 0; font-style:italic; color:rgba(232,232,240,.7); font-size:1rem; }
          .key-points { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:24px; margin:32px 0; }
          .key-points-label { font-family:'Inter',sans-serif; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:var(--muted); margin-bottom:16px; }
          .key-point { display:flex; align-items:flex-start; gap:10px; font-family:'Inter',sans-serif; font-size:.9rem; color:rgba(232,232,240,.8); margin-bottom:10px; line-height:1.5; }
          .key-point::before { content:'→'; color:var(--accent); flex-shrink:0; font-weight:700; }
          .chapter-divider { width:40px; height:2px; background:var(--border); margin:64px 0 0; border-radius:2px; }

          .conclusion { background:linear-gradient(135deg,rgba(220,38,38,.06),rgba(249,115,22,.06)); border:1px solid rgba(249,115,22,.15); border-radius:16px; padding:48px; margin-top:80px; }
          .conclusion-label { font-family:'Inter',sans-serif; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:var(--accent); margin-bottom:16px; }
          .conclusion-title { font-size:1.5rem; font-weight:700; color:#fff; margin-bottom:20px; }
          .conclusion-text { font-size:1rem; line-height:1.8; color:rgba(232,232,240,.75); margin-bottom:24px; }
          .cta-text { font-size:1.05rem; font-weight:700; color:var(--accent); font-family:'Inter',sans-serif; }

          @media print {
            .sidebar { display:none !important; }
            .main { margin-left:0 !important; }
            .content { padding:40px; max-width:100%; }
            body { background:#fff; color:#000; }
            .chapter-content p, .cover-desc, blockquote p { color:#333; }
            .cover-title, .chapter-title, .conclusion-title { color:#000; }
            .cover-bg { display:none; }
            #cover { min-height:auto; padding:40px 0; }
            .conclusion { background:#fff9f5; }
            @page { margin:2cm; }
          }
          @media (max-width:768px) {
            .sidebar { display:none; }
            .main { margin-left:0; }
            .content { padding:40px 24px 80px; }
            .mobile-bar { display:flex !important; }
          }
          .mobile-bar {
            display:none; position:sticky; top:0; z-index:50;
            background:var(--surface); border-bottom:1px solid var(--border);
            padding:12px 16px; align-items:center; justify-content:space-between;
          }
          .mobile-title { font-family:'Inter',sans-serif; font-weight:700; font-size:13px; }
        `}</style>
      </head>
      <body>
        <nav className="sidebar">
          <div className="sidebar-brand">
            <div className="sidebar-tag">📖 Ebook Digital</div>
            <div className="sidebar-title">{ebook.title}</div>
          </div>
          <div className="toc-label">Conteúdo</div>
          <a className="toc-item" href="#cover">
            <span className="toc-num">✦</span> Capa
          </a>
          {ebook.chapters.map((ch, i) => (
            <a key={i} className="toc-item" href={`#cap-${i}`}>
              <span className="toc-num">{i + 1}</span>
              <span style={{ lineHeight: "1.3" }}>{ch.title}</span>
            </a>
          ))}
          <a className="toc-item" href="#conclusion">
            <span className="toc-num">★</span> Conclusão
          </a>
          <div className="sidebar-footer" dangerouslySetInnerHTML={{ __html: '<button class="btn-print" onclick="window.print()">🖨 Salvar como PDF</button>' }} />
        </nav>

        <div className="mobile-bar">
          <span className="mobile-title">{ebook.title}</span>
          <span dangerouslySetInnerHTML={{ __html: '<button class="btn-pdf" style="width:auto;padding:8px 14px;font-size:12px;border:none;" onclick="window.print()">🖨 PDF</button>' }} />
        </div>

        <main className="main">
          <div className="content">
            <section id="cover">
              <div className="cover-bg" />
              <div className="cover-badge">📖 Ebook Digital</div>
              <h1 className="cover-title">{ebook.title}</h1>
              <p className="cover-subtitle">{ebook.subtitle}</p>
              <div className="cover-author">por {ebook.author || "Autor"}</div>
              <div className="cover-divider" />
              <p className="cover-desc">{ebook.description}</p>
            </section>

            {ebook.chapters.map((chapter, i) => (
              <section key={i} id={`cap-${i}`} className="chapter">
                <div className="chapter-num">Capítulo {i + 1}</div>
                <h2 className="chapter-title">{chapter.title}</h2>
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

            <div id="conclusion" className="conclusion">
              <div className="conclusion-label">Conclusão</div>
              <h3 className="conclusion-title">Próximos Passos</h3>
              <p className="conclusion-text">{ebook.conclusion}</p>
              <p className="cta-text">{ebook.callToAction}</p>
            </div>
          </div>
        </main>

        <script dangerouslySetInnerHTML={{ __html: `
          ${autoPrint ? "window.addEventListener('load', function(){ setTimeout(function(){ window.print(); }, 800); });" : ""}

          var links = document.querySelectorAll('.toc-item');
          var sections = document.querySelectorAll('[id]');
          var obs = new IntersectionObserver(function(entries){
            entries.forEach(function(e){
              if(e.isIntersecting){
                links.forEach(function(l){ l.style.color=''; l.style.borderLeftColor='transparent'; l.style.background=''; });
                var a = document.querySelector('.toc-item[href="#'+e.target.id+'"]');
                if(a){ a.style.color='#f97316'; a.style.borderLeftColor='#f97316'; a.style.background='rgba(249,115,22,0.08)'; }
              }
            });
          }, {threshold:0.3});
          sections.forEach(function(s){ obs.observe(s); });
        `}} />
      </body>
    </html>
  );
}
