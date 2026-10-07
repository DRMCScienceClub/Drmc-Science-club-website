import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";

export function JoinCta() {
  return (
    <section className="bg-paper-100 py-12 sm:py-20">
      <Container>
        <div data-reveal="scale" className="dark-canvas relative overflow-hidden rounded-[2rem] px-5 py-9 shadow-soft sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-14 lg:py-14">
          <div aria-hidden="true" className="absolute -right-12 -top-12 size-52 rounded-full border border-gold-300/25" />
          <div aria-hidden="true" className="absolute -bottom-20 right-28 size-48 rounded-full border border-teal-300/20" />
          <div aria-hidden="true" className="absolute left-[46%] top-8 size-20 rounded-full border border-violet-300/15" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-teal-300"><Icon name="sparkles" className="size-4" />Your next experiment starts here</span>
            <h2 className="mt-4 text-balance font-display text-3xl font-extrabold tracking-[-0.035em] text-white sm:text-4xl">Curious minds belong together.</h2>
            <p className="mt-4 max-w-xl leading-7 text-slate-300">Join a community of DRMC students who build, question, research, and turn ambitious ideas into something real.</p>
          </div>
          <div className="relative mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0 lg:flex-col">
            <ButtonLink href="/join" variant="secondary">Join the Club</ButtonLink>
            <ButtonLink href="/about" variant="light">How we work</ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
