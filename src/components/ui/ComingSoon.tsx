import { SlideUp } from "@/components/motion/primitives";

export function ComingSoon({ title, note }: { title: string; note: string }) {
  return (
    <section className="container-page py-24">
      <SlideUp>
        <h1 className="text-5xl font-semibold sm:text-6xl">{title}</h1>
        <p className="mt-5 max-w-lg text-foam/65">{note}</p>
      </SlideUp>
    </section>
  );
}
