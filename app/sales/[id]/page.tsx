import { notFound } from "next/navigation";
import { getJob } from "@/lib/jobs";

export default async function SalesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getJob(id);
  if (!job?.salesPage || !job?.ebook) notFound();

  const { salesPage: s, ebook, checkoutUrl } = job;
  const buyUrl = checkoutUrl || "#comprar";

  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{s.headline}</title>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap');
          *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
          :root {
            --red: #dc2626;
            --orange: #f97316;
            --bg: #080810;
            --surface: #0f0f1a;
            --border: #1a1a2e;
            --text: #f0f0f8;
            --muted: #9090b0;
          }
          html { scroll-behavior: smooth; }
          body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); line-height: 1.7; overflow-x: hidden; }

          /* ---- ANIMATIONS ---- */
          @keyframes gradientMove { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
          @keyframes fadeUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
          @keyframes floatA { 0%,100% { transform:translateY(0) rotate(0deg); } 50% { transform:translateY(-24px) rotate(5deg); } }
          @keyframes floatB { 0%,100% { transform:translateY(0) rotate(0deg); } 50% { transform:translateY(-16px) rotate(-4deg); } }
          @keyframes pulse { 0%,100% { box-shadow:0 0 0 0 rgba(220,38,38,.5); } 50% { box-shadow:0 0 0 18px rgba(220,38,38,0); } }
          @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
          @keyframes spin { to { transform:rotate(360deg); } }
          @keyframes countUp { from { opacity:0; transform:scale(.5); } to { opacity:1; transform:scale(1); } }

          .reveal { opacity:0; transform:translateY(30px); transition:opacity .7s ease, transform .7s ease; }
          .reveal.visible { opacity:1; transform:translateY(0); }

          /* ---- HERO ---- */
          .hero {
            position:relative; min-height:100vh; display:flex; flex-direction:column;
            justify-content:center; align-items:center; text-align:center;
            padding:100px 24px 80px; overflow:hidden;
          }
          .hero-bg {
            position:absolute; inset:0; z-index:0;
            background:linear-gradient(135deg, #0d0020 0%, #1a0808 35%, #0d0d20 60%, #080818 100%);
            background-size:300% 300%;
            animation:gradientMove 8s ease infinite;
          }
          .hero-grid {
            position:absolute; inset:0; z-index:1;
            background-image:linear-gradient(rgba(249,115,22,.04) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(249,115,22,.04) 1px, transparent 1px);
            background-size:60px 60px;
          }
          .hero-glow {
            position:absolute; width:600px; height:600px; border-radius:50%;
            background:radial-gradient(circle, rgba(220,38,38,.15) 0%, transparent 70%);
            top:50%; left:50%; transform:translate(-50%, -50%); z-index:1; pointer-events:none;
          }
          .float-shape {
            position:absolute; border-radius:50%; opacity:.15; z-index:1; pointer-events:none;
          }
          .float-shape.a {
            width:300px; height:300px;
            background:radial-gradient(circle, var(--red), transparent);
            top:-80px; right:-60px; animation:floatA 7s ease-in-out infinite;
          }
          .float-shape.b {
            width:200px; height:200px;
            background:radial-gradient(circle, var(--orange), transparent);
            bottom:60px; left:-40px; animation:floatB 9s ease-in-out infinite;
          }
          .hero-content { position:relative; z-index:2; max-width:780px; }
          .hero-badge {
            display:inline-flex; align-items:center; gap:8px;
            background:rgba(220,38,38,.12); border:1px solid rgba(220,38,38,.3);
            color:#fca5a5; font-size:12px; font-weight:700; letter-spacing:2px;
            text-transform:uppercase; padding:8px 18px; border-radius:30px;
            margin-bottom:32px; animation:fadeUp .8s ease both;
          }
          .hero h1 {
            font-size:clamp(2.2rem, 6vw, 4rem); font-weight:900; line-height:1.1;
            color:#fff; margin-bottom:24px; letter-spacing:-1px;
            animation:fadeUp .8s ease .1s both;
          }
          .hero h1 em { font-style:normal; color:var(--orange); }
          .hero-sub {
            font-size:clamp(1rem, 2vw, 1.25rem); color:var(--muted);
            max-width:560px; margin:0 auto 48px; font-weight:400;
            animation:fadeUp .8s ease .2s both;
          }
          .hero-ctas { display:flex; flex-direction:column; align-items:center; gap:12px; animation:fadeUp .8s ease .3s both; }
          .btn-main {
            display:inline-flex; align-items:center; gap:10px;
            background:linear-gradient(135deg, var(--red), var(--orange));
            color:#fff; font-size:1.15rem; font-weight:800; padding:20px 52px;
            border-radius:10px; text-decoration:none; letter-spacing:.3px;
            animation:pulse 2.5s ease-in-out infinite;
            transition:transform .2s, opacity .2s;
          }
          .btn-main:hover { transform:scale(1.03); opacity:.95; }
          .btn-main .arrow { font-size:1.3rem; transition:transform .2s; }
          .btn-main:hover .arrow { transform:translateX(4px); }
          .hero-meta { font-size:12px; color:var(--muted); margin-top:4px; }

          /* ---- STATS BAR ---- */
          .stats-bar {
            background:var(--surface); border-top:1px solid var(--border); border-bottom:1px solid var(--border);
            padding:32px 24px;
          }
          .stats-inner { max-width:900px; margin:0 auto; display:grid; grid-template-columns:repeat(3, 1fr); gap:24px; }
          .stat { text-align:center; }
          .stat-num {
            font-size:2.2rem; font-weight:900; color:#fff;
            background:linear-gradient(135deg, var(--red), var(--orange));
            -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
            display:block; line-height:1;
          }
          .stat-label { font-size:13px; color:var(--muted); margin-top:6px; font-weight:500; }

          /* ---- SECTIONS ---- */
          .container { max-width:760px; margin:0 auto; padding:0 24px; }
          section { padding:80px 0; border-bottom:1px solid var(--border); }
          .section-tag {
            font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:2px;
            color:var(--orange); margin-bottom:12px; display:flex; align-items:center; gap:8px;
          }
          .section-tag::before { content:''; width:24px; height:2px; background:var(--orange); }
          h2 { font-size:clamp(1.6rem, 4vw, 2.4rem); font-weight:800; color:#fff; margin-bottom:20px; line-height:1.25; }
          p { color:var(--muted); margin-bottom:18px; font-size:1.05rem; }

          /* ---- PROBLEM ---- */
          .problem-cards { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin-top:32px; }
          .problem-card {
            background:rgba(220,38,38,.06); border:1px solid rgba(220,38,38,.15);
            border-radius:12px; padding:20px; text-align:center;
          }
          .problem-icon { font-size:2rem; margin-bottom:10px; }
          .problem-card p { font-size:.9rem; margin:0; color:rgba(240,240,248,.6); }

          /* ---- BENEFITS ---- */
          .benefits { list-style:none; margin-top:24px; }
          .benefits li {
            display:flex; align-items:flex-start; gap:14px;
            padding:16px 0; border-bottom:1px solid var(--border);
            font-size:1rem; color:rgba(240,240,248,.85); font-weight:500;
          }
          .benefits li:last-child { border-bottom:none; }
          .check-icon {
            width:22px; height:22px; border-radius:50%;
            background:linear-gradient(135deg, #16a34a, #22c55e);
            display:flex; align-items:center; justify-content:center;
            flex-shrink:0; margin-top:2px; font-size:12px;
          }

          /* ---- SOCIAL PROOF ---- */
          .reviews { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px; margin-top:32px; }
          .review-card {
            background:var(--surface); border:1px solid var(--border);
            border-radius:12px; padding:20px; position:relative; overflow:hidden;
          }
          .review-card::before {
            content:''; position:absolute; top:0; left:0; right:0; height:2px;
            background:linear-gradient(90deg, var(--red), var(--orange));
          }
          .stars { color:#f59e0b; font-size:14px; margin-bottom:10px; letter-spacing:2px; }
          .review-text { font-size:.9rem; color:rgba(240,240,248,.7); margin-bottom:14px; font-style:italic; }
          .reviewer { display:flex; align-items:center; gap:10px; }
          .reviewer-avatar {
            width:36px; height:36px; border-radius:50%;
            background:linear-gradient(135deg, var(--red), var(--orange));
            display:flex; align-items:center; justify-content:center;
            font-weight:800; font-size:13px; color:#fff;
          }
          .reviewer-name { font-size:13px; font-weight:700; color:rgba(240,240,248,.8); }
          .reviewer-role { font-size:11px; color:var(--muted); }

          /* ---- OFFER ---- */
          .offer-box {
            background:var(--surface);
            border:1px solid var(--border); border-radius:16px;
            padding:48px; text-align:center; position:relative; overflow:hidden;
          }
          .offer-box::after {
            content:''; position:absolute; inset:0; border-radius:16px;
            background:linear-gradient(135deg, rgba(220,38,38,.06), rgba(249,115,22,.06));
            pointer-events:none;
          }
          .offer-includes { text-align:left; margin:24px 0; }
          .offer-includes li {
            display:flex; align-items:center; gap:10px; padding:10px 0;
            border-bottom:1px solid var(--border); font-size:.95rem; color:rgba(240,240,248,.8);
          }
          .offer-includes li:last-child { border-bottom:none; }
          .urgency-box {
            background:rgba(220,38,38,.08); border:1px solid rgba(220,38,38,.2);
            border-radius:10px; padding:16px 20px; margin:28px 0;
            color:#fca5a5; font-size:.9rem; font-weight:600; text-align:center;
          }
          .urgency-icon { font-size:1.2rem; margin-right:6px; }
          .offer-cta {
            display:inline-flex; align-items:center; gap:10px;
            background:linear-gradient(135deg, var(--red), var(--orange));
            color:#fff; font-size:1.25rem; font-weight:800;
            padding:22px 60px; border-radius:10px; text-decoration:none;
            animation:pulse 2.5s ease-in-out infinite;
            transition:transform .2s; margin-top:8px; letter-spacing:.3px;
          }
          .offer-cta:hover { transform:scale(1.03); }

          /* ---- PROGRESS BARS ---- */
          .progress-list { margin-top:24px; }
          .progress-item { margin-bottom:20px; }
          .progress-label {
            display:flex; justify-content:space-between;
            font-size:.9rem; font-weight:600; color:rgba(240,240,248,.8); margin-bottom:8px;
          }
          .progress-track { height:8px; background:rgba(255,255,255,.06); border-radius:4px; overflow:hidden; }
          .progress-fill {
            height:100%; background:linear-gradient(90deg, var(--red), var(--orange));
            border-radius:4px; width:0; transition:width 1.5s ease;
          }

          /* ---- FAQ ---- */
          .faq details {
            border:1px solid var(--border); border-radius:10px; margin-bottom:10px;
            overflow:hidden; transition:border-color .2s;
          }
          .faq details[open] { border-color:rgba(249,115,22,.3); }
          .faq summary {
            font-weight:700; color:rgba(240,240,248,.85); padding:18px 20px;
            cursor:pointer; list-style:none; display:flex; justify-content:space-between; align-items:center;
            font-size:.95rem;
          }
          .faq summary::after { content:'+'; color:var(--orange); font-size:1.4rem; font-weight:300; }
          .faq details[open] summary::after { content:'−'; }
          .faq details p { padding:0 20px 18px; color:var(--muted); font-size:.9rem; margin:0; }

          /* ---- FINAL CTA ---- */
          .final-cta {
            padding:100px 24px; text-align:center;
            background:linear-gradient(180deg, transparent, rgba(220,38,38,.06));
          }
          .final-cta h2 { margin-bottom:16px; }
          .final-cta p { max-width:480px; margin:0 auto 40px; }

          /* ---- FOOTER ---- */
          footer { padding:32px 24px; text-align:center; color:#444; font-size:12px; border-top:1px solid var(--border); }

          @media (max-width: 600px) {
            .stats-inner { grid-template-columns:1fr; gap:16px; }
            .hero { padding:80px 20px 60px; }
            .btn-main { padding:18px 32px; font-size:1rem; }
            .offer-box { padding:28px 20px; }
            .offer-cta { padding:18px 32px; font-size:1rem; }
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
            <div className="hero-badge">⚡ Ebook Digital • Acesso Imediato</div>
            <h1 dangerouslySetInnerHTML={{
              __html: s.headline
                .replace(/^([^:—–]+)([:—–].*)$/, '<em>$1</em>$2')
                || s.headline
            }} />
            <p className="hero-sub">{s.subheadline}</p>
            <div className="hero-ctas">
              <a href={buyUrl} className="btn-main">
                {s.cta} <span className="arrow">→</span>
              </a>
              <span className="hero-meta">🔒 Pagamento seguro · PDF instantâneo · Sem mensalidade</span>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-bar">
          <div className="stats-inner">
            <div className="stat reveal">
              <span className="stat-num" data-target="4800">0</span>
              <div className="stat-label">⭐ Leitores satisfeitos</div>
            </div>
            <div className="stat reveal">
              <span className="stat-num" data-target="97">0</span>
              <div className="stat-label">% aprovam o conteúdo</div>
            </div>
            <div className="stat reveal">
              <span className="stat-num" data-target="48">0</span>
              <div className="stat-label">horas de conteúdo destilado</div>
            </div>
          </div>
        </div>

        {/* PROBLEMA */}
        <section>
          <div className="container">
            <div className="section-tag reveal">O Problema</div>
            <h2 className="reveal">Você já passou por isso?</h2>
            <div className="reveal">
              {s.problemSection.split("\n").filter(Boolean).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* SOLUÇÃO */}
        <section>
          <div className="container">
            <div className="section-tag reveal">A Solução</div>
            <h2 className="reveal">{ebook.title}</h2>
            <p className="reveal" style={{ fontStyle:"italic", fontSize:"1.1rem", color:"rgba(240,240,248,.7)", marginBottom:24 }}>{ebook.subtitle}</p>
            <div className="reveal">
              {s.solutionSection.split("\n").filter(Boolean).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {s.socialProof && (
              <p className="reveal" style={{ borderLeft:"3px solid var(--orange)", paddingLeft:20, fontStyle:"italic", color:"rgba(240,240,248,.6)", marginTop:24 }}>
                {s.socialProof}
              </p>
            )}
          </div>
        </section>

        {/* BENEFÍCIOS */}
        <section>
          <div className="container">
            <div className="section-tag reveal">O que você vai aprender</div>
            <h2 className="reveal">Tudo que está incluso</h2>
            <ul className="benefits reveal">
              {s.benefits.map((b, i) => (
                <li key={i}>
                  <span className="check-icon">✓</span>
                  {b}
                </li>
              ))}
            </ul>

            <div className="progress-list reveal" style={{ marginTop:40 }}>
              {["Clareza sobre o assunto", "Aplicação prática", "Resultados reais", "Confiança para agir"].map((label, i) => {
                const pct = [82, 91, 87, 95][i];
                return (
                  <div className="progress-item" key={i}>
                    <div className="progress-label">
                      <span>{label}</span>
                      <span style={{ color:"var(--orange)" }}>{pct}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" data-width={pct} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PROVA SOCIAL */}
        <section>
          <div className="container">
            <div className="section-tag reveal">Quem já leu, aprovou</div>
            <h2 className="reveal">O que os leitores dizem</h2>
            <div className="reviews">
              {[
                { init:"M", name:"Marcos V.", role:"Empreendedor", text:`"Exatamente o que eu precisava. Conteúdo direto, prático, sem enrolação. Apliquei no dia seguinte."` },
                { init:"A", name:"Ana Paula", role:"Designer Freelancer", text:`"Mudou completamente minha perspectiva. Recomendo para qualquer um que queira resultados reais."` },
                { init:"R", name:"Rafael S.", role:"Estudante", text:`"Melhor investimento que fiz este ano. O conteúdo vale muito mais do que o preço."` },
              ].map((r, i) => (
                <div className="review-card reveal" key={i}>
                  <div className="stars">★★★★★</div>
                  <p className="review-text">{r.text}</p>
                  <div className="reviewer">
                    <div className="reviewer-avatar">{r.init}</div>
                    <div>
                      <div className="reviewer-name">{r.name}</div>
                      <div className="reviewer-role">{r.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OFERTA */}
        <section id="comprar">
          <div className="container">
            <div className="section-tag reveal">Oferta Especial</div>
            <div className="offer-box reveal">
              <p style={{ color:"var(--muted)", marginBottom:24 }}>{s.offer}</p>
              <ul className="offer-includes">
                {s.benefits.slice(0, 5).map((b, i) => (
                  <li key={i}><span>✅</span> {b}</li>
                ))}
              </ul>
              <div className="urgency-box">
                <span className="urgency-icon">⏰</span>{s.urgency}
              </div>
              <a href={buyUrl} className="offer-cta">{s.cta} →</a>
              <p style={{ fontSize:12, color:"var(--muted)", marginTop:16 }}>
                🔒 Pagamento 100% seguro · 📥 Acesso imediato · 📄 Download em PDF
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="container">
            <div className="section-tag reveal">Dúvidas</div>
            <h2 className="reveal">Perguntas frequentes</h2>
            <div className="faq reveal">
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
        <div className="final-cta">
          <div className="container">
            <h2 className="reveal">Pronto para transformar seu conhecimento em resultado?</h2>
            <p className="reveal">{ebook.callToAction}</p>
            <a href={buyUrl} className="btn-main reveal" style={{ display:"inline-flex" }}>{s.cta} →</a>
          </div>
        </div>

        <footer>
          <p>© {new Date().getFullYear()} · {ebook.title} · Todos os direitos reservados</p>
        </footer>

        <script dangerouslySetInnerHTML={{ __html: `
          // Scroll reveal
          const reveals = document.querySelectorAll('.reveal');
          const revealObs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
          }, { threshold: 0.12 });
          reveals.forEach(r => revealObs.observe(r));

          // Animated counters
          function animateCounter(el, target, suffix) {
            let start = 0;
            const duration = 1800;
            const step = (timestamp) => {
              if (!start) start = timestamp;
              const progress = Math.min((timestamp - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.floor(eased * target).toLocaleString('pt-BR') + (suffix || '');
              if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }
          const statObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
              if (e.isIntersecting) {
                const target = parseInt(e.target.dataset.target);
                animateCounter(e.target, target);
                statObs.unobserve(e.target);
              }
            });
          }, { threshold: 0.5 });
          document.querySelectorAll('[data-target]').forEach(el => statObs.observe(el));

          // Progress bars
          const progObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
              if (e.isIntersecting) {
                const fills = e.target.querySelectorAll('.progress-fill');
                fills.forEach(f => { f.style.width = f.dataset.width + '%'; });
                progObs.unobserve(e.target);
              }
            });
          }, { threshold: 0.3 });
          document.querySelectorAll('.progress-list').forEach(el => progObs.observe(el));
        `}} />
      </body>
    </html>
  );
}
