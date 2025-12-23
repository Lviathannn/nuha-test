type Props = {
  title: string;
  description: string;
};

export function PageHeader({ title, description }: Props) {
  return (
    <div>
      <h1 className="text-xl font-semibold text-primary text-nowrap">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground text-nowrap">{description}</p>
    </div>
  );
}
