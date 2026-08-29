import Image from "next/image";
import type { ExecutiveMember } from "@/types/content";

export function ExecutiveCard({ member, prominent = false }: { member: ExecutiveMember; prominent?: boolean }) {
  return (
    <article data-reveal="up" className="surface-card overflow-hidden rounded-2xl border border-surface-border shadow-card">
      <div className={prominent ? "grid grid-cols-[7rem_1fr] items-center" : "grid grid-cols-[5.5rem_1fr] items-center"}>
        <div className={`relative bg-science-50 ${prominent ? "aspect-square" : "aspect-square"}`}>
          <Image src={member.image.src} alt={member.image.alt} fill sizes={prominent ? "112px" : "88px"} className="object-cover" />
        </div>
        <div className="min-w-0 px-4 py-3">
          <h3 className="break-words font-display font-extrabold leading-5 text-navy-950">{member.name}</h3>
          <p className="mt-1 text-xs font-bold leading-5 text-science-700">{member.role}</p>
          {member.academicClass && <p className="mt-1 text-xs text-slate-500">{member.academicClass}</p>}
        </div>
      </div>
    </article>
  );
}
