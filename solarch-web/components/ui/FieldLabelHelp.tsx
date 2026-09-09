"use client"

import { ActionIcon, Group, Popover, Text } from "@mantine/core"
import { IconInfoCircle } from "@tabler/icons-react"

interface Props { label: string; help: string }

export function FieldLabelHelp({ label, help }: Props) {
  return (
    <Group gap={4} wrap="nowrap" component="span">
      <Text component="span" size="sm" fw={500}>{label}</Text>
      <Popover width={280} position="top" withArrow shadow="md">
        <Popover.Target>
          <ActionIcon component="span" role="button" tabIndex={0} size="xs" variant="subtle" color="gray" aria-label={`Información sobre ${label}`}
            onClick={event => event.preventDefault()}
            onKeyDown={event => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                event.currentTarget.click()
              }
            }}
          >
            <IconInfoCircle size={14} />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown><Text size="xs">{help}</Text></Popover.Dropdown>
      </Popover>
    </Group>
  )
}
