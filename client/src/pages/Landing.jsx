import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';

const TerminalWindow = () => (
  <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden shadow-2xl w-full max-w-md mx-auto">
    <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-bg-tertiary">
      <span className="w-2.5 h-2.5 rounded-full bg-danger/60" />
      <span className="w-2.5 h-2.5 rounded-full bg-warning/60" />
      <span className="w-2.5 h-2.5 rounded-full bg-success/60" />
      <span className="text-text-muted text-xs ml-2 font-mono">devsync — zsh</span>
    </div>
    <div className="p-5 font-mono text-sm space-y-1.5">
      <p className="text-text-muted">$ devsync find --skill react --role frontend</p>
      <p className="text-success">✓ 3 developers found nearby</p>
      <p className="text-text-muted">$ devsync connect @priya_codes</p>
      <p className="text-success">✓ request sent</p>
      <p className="text-text-muted">$ devsync post --project "AI Study Planner"</p>
      <p className="text-success">✓ update shared with your network</p>
      <p className="text-text-primary">
        $ <span className="animate-pulse">_</span>
      </p>
    </div>
  </div>
);

const Landing = () => {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-accent text-sm font-mono mb-3">// for developers, by developers</p>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 font-mono leading-tight">
            Find your <span className="text-accent">co-founders</span>,
            <br />
            not just contacts.
          </h1>
          <p className="text-text-secondary text-lg mb-8 max-w-lg">
            DevSync is where developers build profiles, recruit teammates for real projects, and
            share progress — no fluff, just people who ship.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register">
              <Button variant="primary" className="text-base px-6 py-3">
                Create your profile
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" className="text-base px-6 py-3">
                I have an account
              </Button>
            </Link>
          </div>
        </div>

        <TerminalWindow />
      </div>

      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-3 gap-8">
          <div>
            <p className="text-accent font-mono text-sm mb-2">01 — Build</p>
            <h3 className="text-text-primary font-semibold mb-1">Your dev profile</h3>
            <p className="text-text-secondary text-sm">
              Skills, GitHub, portfolio, and what you're working on — all in one place.
            </p>
          </div>
          <div>
            <p className="text-accent font-mono text-sm mb-2">02 — Connect</p>
            <h3 className="text-text-primary font-semibold mb-1">With real developers</h3>
            <p className="text-text-secondary text-sm">
              Search by skill, send connection requests, build your network of collaborators.
            </p>
          </div>
          <div>
            <p className="text-accent font-mono text-sm mb-2">03 — Ship</p>
            <h3 className="text-text-primary font-semibold mb-1">Together</h3>
            <p className="text-text-secondary text-sm">
              Post your project, list the roles you need, and let developers apply directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;