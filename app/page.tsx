import { Hero } from '@/components/sections/hero';
import { ProofStrip } from '@/components/sections/proof-strip';
import { FeaturedWork } from '@/components/sections/featured-work';
import { PlaygroundTeaser } from '@/components/sections/playground-teaser';
import { RigourManifesto } from '@/components/sections/rigour-manifesto';
import { StackGrid } from '@/components/sections/stack-grid';
import { ExperienceTimeline } from '@/components/sections/experience-timeline';
import { Contact } from '@/components/sections/contact';

export default function Home() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <FeaturedWork />
      <PlaygroundTeaser />
      <RigourManifesto />
      <StackGrid />
      <ExperienceTimeline />
      <Contact />
    </>
  );
}
