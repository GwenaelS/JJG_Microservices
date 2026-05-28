export const Footer = () => {
  return (
    <footer className="w-full py-6 border-t border-white/5 bg-background/30 mt-auto">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
        <p className="text-sm text-muted-foreground text-center md:text-left">
          &copy; {new Date().getFullYear()} BriefNest Services. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Accessibility</a>
        </div>
      </div>
    </footer>
  );
};
