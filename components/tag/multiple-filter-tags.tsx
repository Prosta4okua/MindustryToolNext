import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import TagGroup from '@/types/response/TagGroup';

type MultipleFilerTagsProps = {
  group: TagGroup;
  selectedValue: string[];
  handleTagGroupChange: (value: string[]) => void;
};

export default function MultipleFilerTags({
  group,
  selectedValue,
  handleTagGroupChange,
}: MultipleFilerTagsProps) {
  return (
    <ToggleGroup
      className="flex w-full flex-wrap justify-start"
      type={'multiple'}
      onValueChange={handleTagGroupChange}
      defaultValue={selectedValue}
    >
      <span className="whitespace-nowrap text-lg capitalize">{group.name}</span>
      <Separator className="border-[1px]" orientation="horizontal" />
      {group.value.map((value, index) => (
        <ToggleGroupItem className="capitalize" key={index} value={value}>
          {value}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
