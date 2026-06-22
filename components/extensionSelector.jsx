import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const extensions = [
  { label: ".mem", value: "mem" },
  { label: ".vmem", value: "vmem" },
  { label: ".raw", value: "raw" },
  { label: ".img", value: "img" },
];

export function ExtensionSelector() {
  return (
    <Select items={extensions}>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Select extension" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {extensions.map((extension) => (
            <SelectItem key={extension.value} value={extension.value}>
              {extension.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}