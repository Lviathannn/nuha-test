"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { formatRupiah, parseRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";

const InputCurrency = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  const [value, setValue] = React.useState(props.value || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numberValue = parseRupiah(rawValue);
    const formattedValue = formatRupiah(numberValue);

    setValue(formattedValue);
    if (props.onChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: String(numberValue),
        },
      };
      props.onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numberValue = parseRupiah(rawValue);
    const formattedValue = formatRupiah(numberValue);
    setValue(formattedValue);
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  React.useEffect(() => {
    if (props.value) {
      setValue(formatRupiah(parseRupiah(String(props.value))));
    } else {
      setValue("");
    }
  }, [props.value]);

  return (
    <Input
      className={cn(className)}
      ref={ref}
      {...props}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
});
InputCurrency.displayName = "InputCurrency";

export { InputCurrency };
