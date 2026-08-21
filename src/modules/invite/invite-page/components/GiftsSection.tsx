const AMAZON_WISHLIST_URL =
  "https://www.amazon.com.br/hz/wishlist/ls/1OE1ZE6ZHOH57?ref_=wl_share";

import LeafIcon from "@/shared/ui/LeafIcon";

export function GiftsSection() {
  return (
    <div className="flex flex-col items-center">
      {/* Label */}
      <div className="flex items-center justify-center gap-3 mb-4 text-wedding-gold/40">
        <LeafIcon className="h-4 w-4" />
        <p className="font-body text-xs uppercase tracking-widest text-wedding-wood/60">
          Lista de Presentes
        </p>
        <LeafIcon className="h-4 w-4" />
      </div>

      {/* Paragraph with Amazon link */}
      <p className="font-body text-wedding-wood/80 text-sm leading-relaxed max-w-md mx-auto">
        Sua presença já é o nosso maior presente. Se quiser nos presentear,
        montamos uma{" "}
        <a
          href={AMAZON_WISHLIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-wedding-wood underline underline-offset-4 decoration-wedding-gold/60 hover:decoration-wedding-gold"
        >
          lista na Amazon
        </a>
        .
      </p>
    </div>
  );
}
