import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#09090b', // zinc-950
          color: '#ffffff',
          padding: 64,
          position: 'relative',
        }}
      >
        {/* subtle dot grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            backgroundPosition: 'center',
            opacity: 0.22,
          }}
        />

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 999,
              border: '1px solid rgba(39,39,42,1)', // zinc-800
              background: 'rgba(24,24,27,0.7)',
              color: '#e4e4e7',
              fontSize: 22,
              alignSelf: 'flex-start',
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 4,
                background: '#14b8a6', // teal-500
              }}
            />
            Comparison • 2026
          </div>

          <div style={{ marginTop: 26, fontSize: 70, fontWeight: 750, letterSpacing: -1, lineHeight: 1.05, maxWidth: 1040 }}>
            Best Cash Flow Calendar Apps
          </div>
          <div style={{ marginTop: 6, fontSize: 54, fontWeight: 750, letterSpacing: -1, color: '#14b8a6' }}>
            for Freelancers
          </div>

          <div style={{ marginTop: 20, fontSize: 28, color: '#a1a1aa', maxWidth: 900, lineHeight: 1.35 }}>
            Built-in invoicing + invoice→forecast sync + a real free tier.
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(24,24,27,1)',
            paddingTop: 22,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(20,184,166,0.15)',
                border: '1px solid rgba(20,184,166,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: 14, height: 14, borderRadius: 4, background: '#14b8a6' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 24, fontWeight: 650 }}>Cash Flow Forecaster</div>
              <div style={{ fontSize: 20, color: '#71717a' }}>Your 90-day cash flow calendar</div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              padding: '12px 16px',
              borderRadius: 12,
              background: '#14b8a6',
              color: '#09090b',
              fontSize: 22,
              fontWeight: 750,
            }}
          >
            Get Started Free →
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

