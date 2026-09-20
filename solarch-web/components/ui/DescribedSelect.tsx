"use client"

import { Box, Select, Text, type SelectProps } from "@mantine/core"

export interface DescribedOption {
  value: string
  label: string
  description: string
}

type Props = Omit<SelectProps, "data" | "defaultValue" | "renderOption" | "description"> & {
  data: DescribedOption[]
  value: string | null
}

/** Keeps the option explanation associated with the input for keyboard and screen reader users. */
export function DescribedSelect({ data, value, ...props }: Props) {
  return <Select
    {...props}
    value={value}
    data={data}
    description={data.find(option => option.value === value)?.description}
    inputWrapperOrder={["label", "input", "description", "error"]}
    renderOption={({ option }) => <Box style={{ minWidth: 0, whiteSpace: "normal", overflowWrap: "anywhere" }}>
      <Text component="span" size="sm" fw={500} display="block">{option.label}</Text>
      <Text component="span" size="xs" c="dimmed" display="block">
        {data.find(item => item.value === option.value)?.description}
      </Text>
    </Box>}
  />
}
