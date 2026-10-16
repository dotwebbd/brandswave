import { PageTransition } from "@/components/motion/primitives";

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
