type Props = {
  title: string;
};

export default function SectionHeader({ title }: Props) {
  return (
    <div className="bg-kooora-dark h-[34px] flex items-end">
      <h3 className="text-[#fb0] text-[14px] font-bold px-3 pb-1 border-b-2 border-[#fb0]">
        {title}
      </h3>
    </div>
  );
}
