export const LeftHeroPattern = () => {
  const rows = 5;
  const cols = 5;

  return (
    <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 pointer-events-none select-none z-0 gap-0">
      {Array.from({ length: rows * cols }).map((_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        // staggered pattern
        // Determine if this cell should have the pattern
        let isActive = false;
        if (row % 2 === 0) {
          // Rows 1, 3, 5 (index 0, 2, 4) -> Active on cols 1, 3, 5 (index 0, 2, 4)
          if (col % 2 === 0) isActive = true;
        } else {
          // Rows 2, 4 (index 1, 3) -> Active on cols 2, 4 (index 1, 3)
          if (col % 2 !== 0) isActive = true;
        }

        return (
          <div key={i} className="relative border-[0.5px] border-border/20">
            {isActive && (
              <div
                className="absolute inset-0 opacity-100 dark:opacity-50 transition-opacity duration-500"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(315deg, oklch(var(--primary)/0.30) 0, oklch(var(--primary)/0.2) 1px, transparent 0, transparent 50%)",
                  backgroundSize: "9px 9px",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export const RightHeroPattern = () => {
  return (
    <div
      className="absolute inset-0 pointer-events-none mask-[radial-gradient(ellipse_at_center,black,transparent)]"
      style={{
        backgroundImage:
          "linear-gradient(oklch(var(--primary)/0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(var(--primary)/0.3) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />
  );
};

export const EtchingCorner = ({ className }: { className?: string }) => (
  <div
    className={`absolute size-4 border-black dark:border-white ${className}`}
  >
    <div className="absolute w-full h-px bg-black dark:border-white top-0 left-0"></div>
    <div className="absolute h-full w-px bg-black dark:border-white top-0 left-0"></div>
    <div className="absolute top-0 left-0 size-4 bg-foreground"></div>
  </div>
);

export const FooterPattern = () => {
  return (
    <div className="absolute inset-x-0 top-0 h-[300px] md:h-[400px] pointer-events-none overflow-hidden flex justify-center">
      <div
        className="w-[150vw] h-full absolute top-0 bg-size-[50px_50px] opacity-45 dark:opacity-35"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(var(--primary)) 1px, transparent 1px), linear-gradient(to bottom, oklch(var(--primary)) 1px, transparent 1px)",
          transform: "perspective(500px) rotateX(60deg)",
          transformOrigin: "top center",
          maskImage: "linear-gradient(to bottom, black, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black, transparent 100%)",
        }}
      />
    </div>
  );
};

export const BentoPattern = () => {
  return (
    <div className="absolute inset-0 w-[90%] md:w-[85%] mx-auto pointer-events-none">
      <div className="absolute inset-0 grid grid-cols-5 h-full opacity-100 dark:opacity-50">
        <div
          className="relative col-start-1 row-span-full border-x border-primary/10 bg-size-[10px_10px] bg-fixed"
          style={{
            backgroundImage:
              "repeating-linear-gradient(315deg, oklch(var(--primary)/0.3) 0, oklch(var(--primary)/0.1) 1px, transparent 0, transparent 50%)",
          }}
        ></div>
        <div
          className="relative col-start-4 row-span-full border-x border-primary/10 bg-size-[10px_10px] bg-fixed"
          style={{
            backgroundImage:
              "repeating-linear-gradient(315deg, oklch(var(--primary)/0.3) 0, oklch(var(--primary)/0.1) 1px, transparent 0, transparent 50%)",
          }}
        ></div>
      </div>
    </div>
  );
};
