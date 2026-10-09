import { Select } from "@/components/ui/select";

type Option = { value: string; label: string };

export function AdminSelect({ name, label, defaultValue = "", options }: {
  name: string;
  label: string;
  defaultValue?: string;
  options: readonly Option[];
}) {
  return <Select name={name} aria-label={label} defaultValue={defaultValue}>
    {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
  </Select>;
}
