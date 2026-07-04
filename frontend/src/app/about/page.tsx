export default function AboutPage() {
  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--color-text-primary)] mb-6">
          About Codrithm
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
          Codrithm is a student-run community bringing together developers, designers, and tech enthusiasts across Pakistan. We organise workshops, meetups, hackathons, and career events to help students learn, connect, and grow. Codrithm Events is our internal platform for discovering and registering for those community events — not a self-serve hosting tool for the general public.
        </p>
      </div>
    </main>
  );
}


