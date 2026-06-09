import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t bg-card relative overflow-hidden mt-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">

          {/* BRAND */}
          <div className="md:col-span-4 lg:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src="/logo-artikelin.svg"
                  alt="Artikelin"
                  className="h-8 w-auto block dark:hidden group-hover:scale-105 transition-transform duration-300"
                />
                <img
                  src="/logo-artikelin-light.svg"
                  alt="Artikelin"
                  className="h-8 w-auto hidden dark:block group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="font-bold text-xl tracking-tight"></span>
            </Link>

            <p className="text-muted-foreground leading-relaxed max-w-sm">
              A modern technology blog covering programming,
              software development, and the latest technology trends
              for developers.
            </p>
          </div>

          {/* NAVIGATION */}
          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="font-bold mb-6 text-foreground tracking-tight">Navigation</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/articles" className="hover:text-primary transition-colors">Articles</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">About</Link>
              </li>
            </ul>
          </div>

          {/* SOCIAL & CONNECT */}
          <div className="md:col-span-4 lg:col-span-4">
            <h4 className="font-bold mb-6 text-foreground tracking-tight">Connect</h4>
            <div className="flex flex-col gap-4 text-sm text-muted-foreground">
              <a
                href="https://github.com/nrzaky"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/naufalraikhanz"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://naufalraikhanzaky.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                About Me
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Artikelin. All rights reserved.</p>
          <p>Made by Naufal Raikhan Zaky</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;