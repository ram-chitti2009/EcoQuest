import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { decisionTypes } from "../data";
export function DecisionSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="inline-flex items-center justify-between px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm w-[180px] text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        <Select.Value placeholder="Decision Type" className="text-gray-900" />
        <Select.Icon>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="z-50 bg-white border border-gray-200 rounded-md shadow-md">
          <Select.Viewport>
            {decisionTypes.map((type) => (
              <Select.Item
                key={type.value}
                value={type.value}
                className="px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
              >
                <Select.ItemText>{type.label}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check className="w-4 h-4 text-blue-600" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
