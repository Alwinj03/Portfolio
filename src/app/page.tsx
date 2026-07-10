import { all } from '@/lib/content'
import { LoadingScreen } from '@/components/loading-screen'
import { StoryBackground } from '@/components/story-background'
import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { Education } from '@/components/sections/education'
import { ExpandableDocs } from '@/components/sections/expandable-docs'
import { Leadership } from '@/components/sections/leadership'
import { WhitePapers } from '@/components/sections/whitepapers'
import { Tools } from '@/components/sections/tools'
import { Contact } from '@/components/sections/contact'

export default function HomePage() {
  return (
    <>
      <LoadingScreen />

      {/* One continuous, morphing particle system behind the whole page. */}
      <StoryBackground />

      <div className="relative z-10">
        {/* Hero stays transparent so the DNA reads vividly over the 3D. */}
        <Hero />

        {/* The wrapper is transparent so the morphing story stays bright between
            sections; each content card below is glass (blurred, semi-opaque) so
            the animation shows through blurred-but-visible while copy stays legible. */}
        <div className="relative">
          <About />
          <Education />
          <ExpandableDocs
            id="research"
            eyebrow="Research"
            title="Questions worth chasing"
            description="Investigations across biology, computation and engineering. Click any project to read the full story — methods, tools and results."
            icon="research"
            items={all('research')}
          />
          <Leadership />
          <ExpandableDocs
            id="achievements"
            eyebrow="Achievements"
            title="Milestones & recognition"
            description="Fellowships, competitions and awards. Click any milestone to expand the story."
            icon="award"
            items={all('achievements')}
          />
          <WhitePapers />
          <Tools />
        </div>

        <Contact />
      </div>
    </>
  )
}
