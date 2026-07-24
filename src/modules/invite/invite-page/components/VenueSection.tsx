const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
    <circle cx={12} cy={10} r={3} />
  </svg>
);

export function VenueSection() {
  return (
    <section className="w-full md:py-16">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        <h2 className="font-heading text-3xl text-wedding-wood">
          Local do Evento
        </h2>

        <div className="space-y-2">
          <p className="font-body text-wedding-wood text-xl md:text-2xl font-semibold">
            Rancho Casa Azul
          </p>
          <p className="font-body text-wedding-wood/70 text-base leading-relaxed">
            Estrada Não-Identificada
          </p>
          <p className="font-body text-wedding-wood/70 text-base leading-relaxed">
            Ibiraci, MG
          </p>
          <a
            href="https://maps.app.goo.gl/bTiGgPg2TKULLF7L7"
            target="_blank"
            rel="noopener noreferrer"
            className="text-wedding-gold hover:underline inline-flex items-center gap-1 transition-colors"
          >
            Ver no Maps
            <MapPinIcon />
          </a>
        </div>

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.4130094252187!2d-47.101834!3d-20.283165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b0eaf4837971cd%3A0xdcc3e6857e5170e5!2sRancho%20Casa%20Azul!5e0!3m2!1spt-BR!2sbr!4v1784854887295!5m2!1spt-BR!2sbr"
          width="100%"
          height={400}
          className="h-[300px] md:h-[400px]"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Mapa do Rancho Casa Azul"
        />
      </div>
    </section>
  );
}
