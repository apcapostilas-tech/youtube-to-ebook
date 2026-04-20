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
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Georgia', serif; background: #0d0d0d; color: #f0f0f0; line-height: 1.7; }
          .container { max-width: 720px; margin: 0 auto; padding: 0 24px; }
          .hero { background: linear-gradient(135deg, #1a0a0a 0%, #0d0d0d 100%); padding: 80px 0 60px; text-align: center; border-bottom: 1px solid #2a1a1a; }
          .badge { display: inline-block; background: #7f1d1d; color: #fca5a5; font-size: 11px; font-family: sans-serif; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 6px 16px; border-radius: 20px; margin-bottom: 28px; }
          h1 { font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 900; line-height: 1.15; color: #fff; margin-bottom: 20px; }
          h1 span { color: #f97316; }
          .subheadline { font-size: 1.15rem; color: #a1a1aa; max-width: 560px; margin: 0 auto 40px; font-family: sans-serif; }
          .cta-btn { display: inline-block; background: linear-gradient(135deg, #dc2626, #f97316); color: #fff; font-size: 1.1rem; font-weight: 800; font-family: sans-serif; padding: 18px 48px; border-radius: 8px; text-decoration: none; letter-spacing: 0.5px; transition: opacity .2s; box-shadow: 0 8px 32px rgba(220,38,38,0.4); }
          .cta-btn:hover { opacity: 0.9; }
          .cta-sub { font-size: 12px; color: #71717a; margin-top: 12px; font-family: sans-serif; }
          section { padding: 64px 0; border-bottom: 1px solid #1c1c1c; }
          h2 { font-size: 1.8rem; font-weight: 800; color: #fff; margin-bottom: 20px; }
          h3 { font-size: 1.1rem; font-weight: 700; color: #f97316; margin-bottom: 10px; font-family: sans-serif; text-transform: uppercase; letter-spacing: 1px; font-size: 12px; }
          p { color: #a1a1aa; margin-bottom: 16px; font-size: 1.05rem; }
          .benefits { list-style: none; }
          .benefits li { display: flex; align-items: flex-start; gap: 12px; padding: 14px 0; border-bottom: 1px solid #1c1c1c; color: #d4d4d8; font-family: sans-serif; }
          .benefits li::before { content: "✓"; color: #22c55e; font-weight: 900; font-size: 1.1rem; flex-shrink: 0; margin-top: 2px; }
          .offer-box { background: #111; border: 1px solid #2a2a2a; border-radius: 12px; padding: 40px; text-align: center; }
          .price-label { font-size: 12px; color: #71717a; font-family: sans-serif; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
          .price { font-size: 3rem; font-weight: 900; color: #f97316; font-family: sans-serif; }
          .urgency-box { background: #1c0a0a; border: 1px solid #7f1d1d; border-radius: 8px; padding: 20px 24px; margin: 24px 0; color: #fca5a5; font-family: sans-serif; font-size: 0.9rem; }
          .faq details { border-bottom: 1px solid #1c1c1c; }
          .faq summary { font-family: sans-serif; font-weight: 600; color: #d4d4d8; padding: 18px 0; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; }
          .faq summary::after { content: "+"; color: #f97316; font-size: 1.3rem; }
          .faq details[open] summary::after { content: "−"; }
          .faq details p { padding: 0 0 18px; margin: 0; }
          footer { padding: 40px 0; text-align: center; color: #52525b; font-family: sans-serif; font-size: 12px; }
          .section-cta { text-align: center; padding: 64px 0; }
        `}</style>
      </head>
      <body>
        {/* Hero */}
        <div className="hero">
          <div className="container">
            <div className="badge">Ebook Digital</div>
            <h1 dangerouslySetInnerHTML={{ __html: s.headline.replace(/\b(\w+)\b(?=\s*—|\s*:|\s*em\b|\s*para\b)/i, '<span>$1</span>') }} />
            <p className="subheadline">{s.subheadline}</p>
            <a href={buyUrl} className="cta-btn">{s.cta} →</a>
            <p className="cta-sub">Acesso imediato · Download em PDF</p>
          </div>
        </div>

        {/* Problema */}
        <section>
          <div className="container">
            <h3>O Problema</h3>
            <h2>Você já passou por isso?</h2>
            {s.problemSection.split("\n").filter(Boolean).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {/* Solução */}
        <section>
          <div className="container">
            <h3>A Solução</h3>
            <h2>{ebook.title}</h2>
            <p style={{ fontStyle: "italic", color: "#d4d4d8", fontSize: "1.1rem", marginBottom: "24px" }}>{ebook.subtitle}</p>
            {s.solutionSection.split("\n").filter(Boolean).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {/* Benefícios */}
        <section>
          <div className="container">
            <h3>O que você vai aprender</h3>
            <h2>Tudo que está incluso</h2>
            <ul className="benefits">
              {s.benefits.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
        </section>

        {/* Oferta */}
        <section>
          <div className="container">
            <div className="offer-box">
              <h3 style={{ marginBottom: "16px" }}>Oferta especial</h3>
              <p style={{ color: "#a1a1aa", marginBottom: "24px" }}>{s.offer}</p>
              <div className="urgency-box">{s.urgency}</div>
              <br />
              <a href={buyUrl} className="cta-btn" style={{ fontSize: "1.2rem", padding: "22px 60px" }}>
                {s.cta} →
              </a>
              <p className="cta-sub">Pagamento seguro · Acesso imediato</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="container">
            <h3>Dúvidas frequentes</h3>
            <h2>Perguntas & Respostas</h2>
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

        {/* CTA final */}
        <div className="section-cta">
          <div className="container">
            <h2>Pronto para começar?</h2>
            <p style={{ marginBottom: "32px" }}>{ebook.callToAction}</p>
            <a href={buyUrl} className="cta-btn" style={{ fontSize: "1.2rem" }}>{s.cta} →</a>
          </div>
        </div>

        <footer>
          <div className="container">
            <p>© {new Date().getFullYear()} · {ebook.title}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
