import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="max-w-2xl">
        <span className="stamp mb-6 inline-block">Now cataloguing</span>
        <h1 className="font-display text-5xl font-semibold leading-tight mb-6">
          Every internship leaves a paper trail.
          <br />
          This is yours.
        </h1>
        <p className="font-body text-lg text-ink/75 leading-relaxed mb-8">
          Intern Showcase turns your project work into a real, linkable catalog —
          the kind you can drop straight into a job application instead of explaining
          it from memory in an interview.
        </p>
        <div className="flex gap-4 font-mono text-sm uppercase tracking-wider">
          <Link
            to="/signup"
            className="bg-ink text-linen px-6 py-3 hover:bg-rust transition-colors"
          >
            Start your catalog
          </Link>
          <Link
            to="/login"
            className="border border-ink px-6 py-3 hover:bg-ink hover:text-linen transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { num: "01", title: "Add a project", body: "Title, description, tags, and a screenshot — takes under a minute per entry." },
          { num: "02", title: "Build your catalog", body: "Every project you add becomes part of one continuous, browsable portfolio." },
          { num: "03", title: "Share the link", body: "One URL for your whole portfolio, or a direct link to any single project." },
        ].map((step) => (
          <div key={step.num} className="catalog-card p-6 pt-8">
            <span className="font-mono text-xs text-rust">{step.num}</span>
            <h3 className="font-display text-lg font-semibold mt-2 mb-2">{step.title}</h3>
            <p className="font-body text-sm text-ink/70 leading-relaxed">{step.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
