import { useState } from 'react';

export default function App() {
  const [jobText, setJobText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAnalyzer, setShowAnalyzer] = useState(false);

  const analyzeOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: jobText })
      });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Unable to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showAnalyzer) {
    return (
      <div style={{ background: '#F8FAFC', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
        <header style={{ padding: '20px 24px', background: '#FFFFFF', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }} />
            <span style={{ fontWeight: 600, fontSize: '18px', color: '#0F172A' }}>ScamProof</span>
          </div>
          <button onClick={() => { setShowAnalyzer(false); setResult(null); setError(null); setJobText(''); }} style={{ background: 'none', border: '1px solid #E2E8F0', borderRadius: '999px', padding: '8px 16px', cursor: 'pointer', color: '#475569', fontSize: '14px' }}>
            Back
          </button>
        </header>

        <div style={{ maxWidth: '720px', margin: '60px auto', padding: '0 24px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0F172A', textAlign: 'center', marginBottom: '12px' }}>Analyze Your Job Offer</h2>
          <p style={{ textAlign: 'center', color: '#475569', fontSize: '16px', marginBottom: '32px' }}>Paste the full job offer below</p>

          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(15,23,42,0.06)', border: '1px solid #E2E8F0' }}>
            <form onSubmit={analyzeOffer}>
              <textarea
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                placeholder="Paste your job offer text here..."
                required
                style={{ width: '100%', minHeight: '200px', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '15px', fontFamily: 'inherit', lineHeight: 1.6, resize: 'vertical', background: '#F8FAFC', color: '#0F172A', outline: 'none' }}
              />
              <button
                type="submit"
                disabled={loading || !jobText.trim()}
                style={{ marginTop: '16px', padding: '14px 24px', borderRadius: '999px', fontSize: '16px', fontWeight: 600, color: '#FFFFFF', background: loading || !jobText.trim() ? '#94A3B8' : 'linear-gradient(135deg, #4F46E5, #7C3AED)', border: 'none', cursor: loading || !jobText.trim() ? 'not-allowed' : 'pointer', width: '100%', boxShadow: '0 4px 16px rgba(79,70,229,0.25)' }}
              >
                {loading ? 'Analyzing...' : 'Analyze Job Offer'}
              </button>
            </form>

            {error && (
              <div style={{ marginTop: '16px', padding: '16px', borderRadius: '12px', background: '#FEE2E2', border: '1px solid #FECACA', color: '#991B1B', fontSize: '14px' }}>
                {error}
              </div>
            )}

            {result && (
              <div style={{ marginTop: '24px' }}>
                <div style={{ padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A' }}>Risk Score</span>
                    <span style={{ fontSize: '32px', fontWeight: 700, color: result.score >= 60 ? '#DC2626' : '#16A34A' }}>{result.score}<span style={{ fontSize: '16px', color: '#475569', fontWeight: 500 }}>/100</span></span>
                  </div>

                  {result.flags && result.flags.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', marginBottom: '10px' }}>Warning Signs</div>
                      <div>
                        {result.flags.map((flag: string, i: number) => (
                          <div key={i} style={{ padding: '10px 12px', marginBottom: '8px', borderRadius: '8px', background: '#FEF3C7', border: '1px solid #FDE68A', fontSize: '14px', color: '#92400E' }}>
                            {flag}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.next_steps && (
                    <div style={{ padding: '16px', borderRadius: '10px', background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#166534', marginBottom: '6px' }}>Next Steps</div>
                      <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#15803D' }}>{result.next_steps}</div>
                    </div>
                  )}
                </div>

                <button onClick={() => { setResult(null); setJobText(''); }} style={{ marginTop: '16px', padding: '12px', borderRadius: '999px', fontSize: '15px', fontWeight: 600, color: '#475569', background: '#FFFFFF', border: '1px solid #E2E8F0', cursor: 'pointer', width: '100%' }}>
                  Analyze Another Offer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* HERO */}
      <section style={{ position: 'relative', padding: '100px 24px 80px', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '600px', background: 'radial-gradient(ellipse at center, rgba(79,70,229,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: '880px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px', fontSize: '17px', fontWeight: 600, color: '#0F172A' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '7px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }} />
            <span>ScamProof</span>
          </div>

          <h1 style={{ fontSize: '56px', lineHeight: 1.08, fontWeight: 700, color: '#0F172A', marginBottom: '20px' }}>
            Verify job offers<br />before you commit
          </h1>

          <p style={{ margin: '0 auto 44px', maxWidth: '580px', fontSize: '19px', lineHeight: 1.6, color: '#475569' }}>
            ScamProof helps you understand the safety of a job offer quietly, clearly, and without blocking opportunity.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
            <button onClick={() => setShowAnalyzer(true)} style={{ padding: '14px 32px', borderRadius: '999px', fontSize: '16px', fontWeight: 600, color: '#FFFFFF', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(79,70,229,0.3)' }}>
              Get Started
            </button>
            <a href="#how-it-works" style={{ padding: '14px 32px', borderRadius: '999px', fontSize: '16px', fontWeight: 600, color: '#0F172A', background: '#FFFFFF', border: '1px solid #E2E8F0', cursor: 'pointer', textDecoration: 'none', boxShadow: '0 1px 3px rgba(15,23,42,0.04)' }}>
              How It Works
            </a>
          </div>

          <p style={{ fontSize: '14px', color: '#64748B' }}>No credit card required</p>

          {/* Trust Strip */}
          <div style={{ marginTop: '56px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { title: 'Your data stays private', desc: 'We analyze offers without storing personal information.' },
              { title: 'Optional protection', desc: "ScamProof informs you. It doesn't decide for you." },
              { title: 'Built for clarity', desc: 'Understand risk without fear or hype.' }
            ].map((item, i) => (
              <div key={i} style={{ padding: '20px', borderRadius: '12px', border: '1px solid #F1F5F9', background: '#FFFFFF', boxShadow: '0 1px 3px rgba(15,23,42,0.04)', textAlign: 'left' }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>{item.title}</div>
                <div style={{ fontSize: '14px', lineHeight: 1.5, color: '#475569' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section style={{ padding: '88px 24px', background: '#FFFFFF', borderTop: '1px solid #F1F5F9' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '40px', lineHeight: 1.1, fontWeight: 700, color: '#0F172A', marginBottom: '16px', textAlign: 'center' }}>Job scams are evolving</h2>
          <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#475569', maxWidth: '580px', margin: '0 auto 56px', textAlign: 'center' }}>
            Fraudulent offers are harder to spot, and the cost of a mistake is real.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { title: 'Convincing tactics', desc: 'Scammers use real company names, professional language, and urgent timelines to appear legitimate.' },
              { title: 'High personal cost', desc: 'Accepting a fake offer can mean lost time, financial risk, or compromised identity.' },
              { title: 'No clear signals', desc: 'Without expertise, it is difficult to know what warning signs matter most.' }
            ].map((item, i) => (
              <div key={i} style={{ padding: '28px', borderRadius: '12px', border: '1px solid #F1F5F9', background: '#F8FAFC' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#475569', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '88px 24px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '40px', lineHeight: 1.1, fontWeight: 700, color: '#0F172A', marginBottom: '16px', textAlign: 'center' }}>How ScamProof works</h2>
          <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#475569', maxWidth: '580px', margin: '0 auto 56px', textAlign: 'center' }}>
            A calm, intelligent review of your job offer in three steps.
          </p>
          <div style={{ display: 'grid', gap: '20px' }}>
            {[
              { title: 'Submit your offer', desc: 'Paste the job offer text. We handle the rest.' },
              { title: 'We analyze key signals', desc: 'Our system reviews communication patterns, domain legitimacy, and known fraud indicators.' },
              { title: 'Receive a clear assessment', desc: 'You get a straightforward risk evaluation. No jargon, no fear tactics.' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '20px', padding: '28px', borderRadius: '12px', border: '1px solid #F1F5F9', background: '#FFFFFF', boxShadow: '0 1px 3px rgba(15,23,42,0.04)', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '18px' }}>
                  {i + 1}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', margin: '0 0 6px 0' }}>{item.title}</h3>
                  <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#475569', margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '88px 24px', background: '#FFFFFF', borderTop: '1px solid #F1F5F9' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '40px', lineHeight: 1.1, fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>Ready to verify your offer?</h2>
          <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#475569', maxWidth: '500px', margin: '0 auto 40px' }}>
            Start analyzing job offers in seconds. No signup required.
          </p>
          <button onClick={() => setShowAnalyzer(true)} style={{ padding: '16px 40px', borderRadius: '999px', fontSize: '18px', fontWeight: 600, color: '#FFFFFF', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(79,70,229,0.25)' }}>
            Analyze a Job Offer
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '48px 24px', background: '#FFFFFF', borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '6px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }} />
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A' }}>ScamProof</span>
          </div>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginBottom: '16px' }}>
            {['Privacy Policy', 'Terms of Service', 'Support'].map((link, i) => (
              <a key={i} href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: '14px' }}>{link}</a>
            ))}
          </div>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>2026 ScamProof. Built to protect opportunity, not block it.</p>
        </div>
      </footer>
    </div>
  );
}
