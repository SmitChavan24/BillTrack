import { PERSONAS, PERSONA_BADGE, type PersonaKey } from "@/lib/personas";

export default function PersonaBadge({ persona }: { persona: PersonaKey }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${PERSONA_BADGE[persona]}`}
    >
      {PERSONAS[persona].label}
    </span>
  );
}
