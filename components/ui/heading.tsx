import { Cat, PawPrint } from "lucide-react";

interface HeadingProps {
  title: string;
  description: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-3 flex items-center">
        {title}
        <Cat size={26} className="ml-2" />
        <PawPrint size={26} className="mr-2" />
      </h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
