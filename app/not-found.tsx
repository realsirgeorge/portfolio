import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page py-24 sm:py-32">
      <p className="eyebrow eyebrow-accent">404</p>
      <h1 className="mt-4 font-display text-5xl text-foreground sm:text-6xl">Nothing at this address.</h1>
      <p className="lede mt-6 max-w-xl">
        The page may have moved, or the link was never valid. Enumeration is
        appreciated in scope, less so here.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">Home</Link>
        <Link href="/work" className="btn btn-ghost">See the work</Link>
      </div>
    </section>
  );
}
