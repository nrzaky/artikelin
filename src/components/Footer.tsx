const Footer = () => {
  return (
    <footer className="border-t mt-20">
      <div className="container mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold tracking-tight text-foreground">Artikelin</span>
          <p className="text-xs text-muted-foreground">
            © 2026 Artikelin. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
