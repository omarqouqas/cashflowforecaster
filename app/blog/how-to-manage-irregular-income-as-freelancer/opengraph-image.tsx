import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/blog/posts';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const post = getPostBySlug('how-to-manage-irregular-income-as-freelancer')!;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#09090b',
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
            flex: 1,
          }}
        >
          {/* brand + category */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 40,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#09090b',
                }}
              >
                C
              </div>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#a1a1aa' }}>Cash Flow Forecaster</div>
            </div>
            <div
              style={{
                display: 'flex',
                padding: '8px 16px',
                borderRadius: 20,
                background: 'rgba(20,184,166,0.15)',
                border: '1px solid rgba(20,184,166,0.3)',
                fontSize: 16,
                fontWeight: 600,
                color: '#14b8a6',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {post.category}
            </div>
          </div>

          {/* title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: 56,
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: -1,
                maxWidth: 1000,
              }}
            >
              {post.title}
            </div>
            <div
              style={{
                marginTop: 24,
                fontSize: 26,
                color: '#a1a1aa',
                maxWidth: 900,
                lineHeight: 1.4,
              }}
            >
              {post.description}
            </div>
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(39,39,42,1)',
            paddingTop: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 700,
                color: '#09090b',
              }}
            >
              CF
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#e4e4e7' }}>{post.author.name}</div>
              <div style={{ fontSize: 16, color: '#71717a' }}>{post.readingTime}</div>
            </div>
          </div>
          <div style={{ fontSize: 18, color: '#71717a' }}>cashflowforecaster.io</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
