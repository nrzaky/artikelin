const Footer = () => {
  return (
    <footer className="border-t mt-20">
      <div className="container mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="text-sm font-bold tracking-tight text-foreground">Artikelin</span>
          <p className="text-xs text-muted-foreground">
            Built with React, Tailwind CSS, and Vite.
          </p>
          <p className="text-xs text-muted-foreground">
            Github : <a href="https://github.com/nrzaky" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">nrzaky</a>
          </p>
          <p className="text-xs text-muted-foreground">
            © 2026 Artikelin Made By Naufal Raikhan Zaky. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
