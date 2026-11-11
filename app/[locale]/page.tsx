import React from 'react';

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0F172A',
      color: '#FFFFFF',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '24px',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        backgroundColor: '#1E293B',
        padding: '40px 32px',
        borderRadius: '16px',
        border: '1px solid #334155',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Merk / Logo */}
        <h1 style={{
          fontSize: '36px',
          fontWeight: '800',
          letterSpacing: '2px',
          color: '#C69C4D',
          margin: '0 0 16px 0'
        }}>
          CARPETZ
        </h1>

        {/* Status Badge */}
        <div style={{
          display: 'inline-block',
          backgroundColor: 'rgba(198, 156, 77, 0.15)',
          color: '#C69C4D',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '24px',
          border: '1px solid rgba(198, 156, 77, 0.3)'
        }}>
          Under Construction
        </div>

        {/* Melding */}
        <h2 style={{
          fontSize: '22px',
          fontWeight: '600',
          marginBottom: '12px',
          color: '#F8FAFC'
        }}>
          We werken momenteel aan onze nieuwe webshop!
        </h2>

        <p style={{
          color: '#94A3B8',
          fontSize: '15px',
          lineHeight: '1.6',
          marginBottom: '32px'
        }}>
          Onze vernieuwde website voor custom logomatten en event-tapijten wordt achter de schermen klaargezet. Heb je een dringende vraag of wil je een bestelling plaatsen?
        </p>

        {/* Actieknoppen */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <a
            href="mailto:info@carpetz.be"
            style={{
              backgroundColor: '#C69C4D',
              color: '#FFFFFF',
              padding: '14px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '15px',
              transition: 'background-color 0.2s'
            }}
          >
            Stuur ons een e-mail
          </a>

          <a
            href="tel:+32485464949"
            style={{
              backgroundColor: 'transparent',
              color: '#94A3B8',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '14px',
              border: '1px solid #475569'
            }}
          >
            Bel +32 485 46 49 49
          </a>
        </div>
      </div>
    </main>
  );
}