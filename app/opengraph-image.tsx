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
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            backgroundPosition: 'center',
            opacity: 0.28,
          }}
        />

        {/* main content */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 38,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(20,184,166,0.18)',
                border: '2px solid rgba(20,184,166,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: 18, height: 18, borderRadius: 4, background: '#14b8a6' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 26, fontWeight: 650, color: '#e4e4e7' }}>Cash Flow Forecaster</div>
              <div style={{ fontSize: 18, color: '#a1a1aa' }}>For freelancers with irregular income</div>
            </div>
          </div>

          {/* headline */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 72, fontWeight: 750, lineHeight: 1.05, letterSpacing: -1, maxWidth: 1040 }}>
              Freelance Income is Unpredictable
            </div>
            <div style={{ fontSize: 72, fontWeight: 750, lineHeight: 1.05, letterSpacing: -1, color: '#14b8a6' }}>
              Your Bank Balance Doesn&apos;t Have to Be
            </div>
          </div>

          {/* subheadline */}
          <div
            style={{
              marginTop: 26,
              fontSize: 28,
              color: '#a1a1aa',
              maxWidth: 820,
              lineHeight: 1.35,
            }}
          >
            See exactly when you&apos;ll run low - before it happens. Built for freelancers and gig workers with irregular
            paychecks.
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(39,39,42,1)', // zinc-800
            paddingTop: 24,
            gap: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: '#14b8a6' }} />
              <div style={{ fontSize: 18, color: '#71717a' }}>Works with irregular income</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: '#14b8a6' }} />
              <div style={{ fontSize: 18, color: '#71717a' }}>Spot low days early</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: '#14b8a6' }} />
              <div style={{ fontSize: 18, color: '#71717a' }}>Free plan available</div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              padding: '14px 28px',
              borderRadius: 12,
              background: '#14b8a6',
              color: '#09090b',
              fontSize: 20,
              fontWeight: 750,
              whiteSpace: 'nowrap',
            }}
          >
            Start Free →
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

