import TagName from '@/components/tag/tag-name';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import TagGroup from '@/types/response/TagGroup';

type SingeFilerTagsProps = {
  group: TagGroup;
  selectedValue: string;
  handleTagGroupChange: (value: string) => void;
};

export default function SingeFilerTags({
  group,
  selectedValue,
  handleTagGroupChange,
}: SingeFilerTagsProps) {
  return (
    <ToggleGroup
      className="flex w-full flex-wrap justify-start"
      type={'single'}
      value={selectedValue}
      onValueChange={handleTagGroupChange}
    >
      <span className="whitespace-nowrap text-lg capitalize">{group.name}</span>
      <Separator className="border-[1px]" orientation="horizontal" />
      {group.values.map((value) => (
        <ToggleGroupItem
          className="capitalize hover:bg-brand hover:text-background data-[state=on]:bg-brand data-[state=on]:text-background dark:hover:text-foreground data-[state=on]:dark:text-foreground"
          key={value}
          value={value}
        >
          <TagName>{value}</TagName>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
