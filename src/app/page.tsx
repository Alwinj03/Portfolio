import { all, toCards } from '@/lib/content'
import { LoadingScreen } from '@/components/loading-screen'
import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { Education } from '@/components/sections/education'
import { GridSection } from '@/components/sections/grid-section'
import { Achievements } from '@/components/sections/achievements'
import { Experience } from '@/components/sections/experience'
import { Leadership } from '@/components/sections/leadership'
import { WhitePapers } from '@/components/sections/whitepapers'
import { Tools } from '@/components/sections/tools'
import { Gallery } from '@/components/sections/gallery'
import { Timeline } from '@/components/sections/timeline'
import { Vision } from '@/components/sections/vision'
import { Contact } from '@/components/sections/contact'

export default function HomePage() {
  return (
    <>
      <LoadingScreen />
      <Hero />
      <About />
      <Education />
      <GridSection
        id="research"
        collection="research"
        eyebrow="Research"
        title="Questions worth chasing"
        description="Investigations across biology, computation and engineering — methods, tools and impact."
      />
      <GridSection
        id="projects"
        collection="projects"
        eyebrow="Projects"
        title="Things I've built"
        description="Products, prototypes and open-source systems, from architecture to roadmap."
      />
      <Achievements items={toCards(all('achievements'))} />
      <Experience />
      <Leadership />
      <WhitePapers />
      <Tools />
      <Gallery items={toCards(all('gallery'))} />
      <Timeline items={toCards(all('timeline'))} />
      <GridSection
        id="blog"
        collection="blog"
        eyebrow="Writing"
        title="Notes & essays"
        description="Thinking in public about science, technology and the future."
        columns={3}
      />
      <Vision />
      <Contact />
    </>
  )
}
