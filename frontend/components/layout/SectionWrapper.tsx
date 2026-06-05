interface Props {
  id?: string;
  className?: string;
  bg?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export default function SectionWrapper({
  id,
  className = '',
  bg = '',
  children,
  fullWidth = false,
}: Props) {
  return (
    <section id={id} className={`relative overflow-hidden ${bg} ${className}`}>
      {fullWidth ? (
        children
      ) : (
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
          {children}
        </div>
      )}
    </section>
  );
}
