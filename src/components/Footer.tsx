const Footer = () => {
  return (
    <footer className="border-t mt-20 bg-muted/30">

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16">

        <div className="grid md:grid-cols-3 gap-10">

          {/* BRAND */}

          <div>

            <h3 className="text-lg font-bold mb-3">
              Artikelin
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Artikelin adalah blog teknologi yang membahas dunia
              pemrograman, software development, dan tren teknologi
              terbaru untuk developer modern.
            </p>

          </div>

          {/* NAVIGATION */}

          <div>

            <h4 className="font-semibold mb-3">
              Navigation
            </h4>

            <ul className="space-y-2 text-sm text-muted-foreground">

              <li>
                <a
                  href="/"
                  className="hover:text-foreground transition"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="/articles"
                  className="hover:text-foreground transition"
                >
                  Articles
                </a>
              </li>

              <li>
                <a
                  href="/about"
                  className="hover:text-foreground transition"
                >
                  About
                </a>
              </li>

            </ul>

          </div>

          {/* SOCIAL */}

          <div>

            <h4 className="font-semibold mb-3">
              Connect
            </h4>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">

              <a
                href="https://github.com/nrzaky"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition"
              >
                GitHub
              </a>

              <a
                href="https://linkedin.com/in/naufalraikhanz"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition"
              >
                LinkedIn
              </a>

            </div>

          </div>

        </div>

        {/* BOTTOM */}

        <div className="border-t mt-10 pt-6 text-center text-xs text-muted-foreground">

          © 2026 Artikelin — Made by Naufal Raikhan Zaky

        </div>

      </div>

    </footer>
  );
};

export default Footer;