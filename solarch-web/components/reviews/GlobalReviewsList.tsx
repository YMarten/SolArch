"use client"

import { useEffect, useState } from "react"
import {
    Stack, Title, Text, Paper, Group, Badge, Tabs,
    Loader, Center, Anchor, SimpleGrid, Select
} from "@mantine/core"
import { reviewsService } from "@/services/reviews.service"
import { ReviewResult, ActionStatus } from "@/types/review"

interface PendingAction {
    id: string
    description: string
    responsible: string
    dueDate?: string
    status: ActionStatus
    review: {
        id: string
        result: ReviewResult
        solution: { id: string; name: string }
    }
}

interface ReviewSummary {
    id: string
    reviewedAt: string
    reviewedBy: string
    result: ReviewResult
    summary?: string
    reviewedVersion?: string
    nextReviewDate?: string
    solution: { id: string; name: string }
    dimensions: { id: string }[]
    actions: { id: string; status: ActionStatus }[]
}

const resultConfig: Record<ReviewResult, { label: string; color: string }> = {
    COMPLIANT: { label: "Cumple", color: "green" },
    COMPLIANT_WITH_NOTES: { label: "Cumple con observaciones", color: "yellow" },
    NON_COMPLIANT: { label: "No cumple", color: "red" },
    IN_REVIEW: { label: "En revisión", color: "blue" },
}

const actionStatusConfig: Record<ActionStatus, { label: string; color: string }> = {
    PENDING: { label: "Pendiente", color: "gray" },
    IN_PROGRESS: { label: "En progreso", color: "blue" },
    COMPLETED: { label: "Completada", color: "green" },
    CANCELLED: { label: "Cancelada", color: "red" },
}

export function GlobalReviewsList() {
    const [actions, setActions] = useState<PendingAction[]>([])
    const [loading, setLoading] = useState(true)
    const [filterResult, setFilterResult] = useState<string | null>(null)
    const [filterStatus, setFilterStatus] = useState<string | null>(null)

    useEffect(() => {
        reviewsService.getPendingActions()
            .then(setActions)
            .finally(() => setLoading(false))
    }, [])

    const filteredActions = actions.filter(a => {
        const matchStatus = !filterStatus || a.status === filterStatus
        const matchResult = !filterResult || a.review.result === filterResult
        return matchStatus && matchResult
    })

    const isOverdue = (dueDate?: string) => {
        if (!dueDate) return false
        return new Date(dueDate) < new Date()
    }

    if (loading) return <Center h={400}><Loader /></Center>

    return (
        <Stack gap="xl" p="xl">
            <Title order={2}>Revisiones arquitectónicas</Title>

            <Tabs defaultValue="actions">
                <Tabs.List>
                    <Tabs.Tab value="actions">
                        Acciones pendientes
                        {actions.filter(a => a.status !== "COMPLETED" && a.status !== "CANCELLED").length > 0 && (
                            <Badge ml="xs" size="xs" color="red" variant="filled">
                                {actions.filter(a => a.status !== "COMPLETED" && a.status !== "CANCELLED").length}
                            </Badge>
                        )}
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="actions" pt="md">
                    <Stack gap="md">
                        <Group gap="sm">
                            <Select
                                placeholder="Filtrar por estado..."
                                clearable
                                value={filterStatus}
                                onChange={setFilterStatus}
                                style={{ width: 180 }}
                                data={[
                                    { value: "PENDING", label: "Pendiente" },
                                    { value: "IN_PROGRESS", label: "En progreso" },
                                    { value: "COMPLETED", label: "Completada" },
                                    { value: "CANCELLED", label: "Cancelada" },
                                ]}
                            />
                            <Select
                                placeholder="Filtrar por resultado de revisión..."
                                clearable
                                value={filterResult}
                                onChange={setFilterResult}
                                style={{ width: 240 }}
                                data={[
                                    { value: "COMPLIANT", label: "Cumple" },
                                    { value: "COMPLIANT_WITH_NOTES", label: "Cumple con observaciones" },
                                    { value: "NON_COMPLIANT", label: "No cumple" },
                                    { value: "IN_REVIEW", label: "En revisión" },
                                ]}
                            />
                        </Group>

                        {filteredActions.length === 0 ? (
                            <Center h={200}>
                                <Text c="dimmed">No hay acciones que coincidan con los filtros.</Text>
                            </Center>
                        ) : (
                            <Stack gap="sm">
                                {filteredActions.map(action => (
                                    <Paper key={action.id} withBorder p="md" radius="md">
                                        <Group justify="space-between" align="flex-start">
                                            <Stack gap={4} style={{ flex: 1 }}>
                                                <Group gap={4} style={{ flex: 1 }}>
                                                    <Anchor
                                                        size="sm"
                                                        fw={500}
                                                        href={`/solutions/${action.review.solution.id}`}
                                                    >
                                                        {action.review.solution.name}
                                                    </Anchor>
                                                    <Text size="sm" c="dimmed">·</Text>
                                                    <Anchor
                                                        size="xs"
                                                        c="dimmed"
                                                        href={`/solutions/${action.review.solution.id}/reviews/${action.review.id}`}
                                                    >
                                                        Ver revisión →
                                                    </Anchor>
                                                    <Badge
                                                        color={resultConfig[action.review.result].color}
                                                        variant="light"
                                                        size="xs"
                                                    >
                                                        {resultConfig[action.review.result].label}
                                                    </Badge>
                                                </Group>

                                                <Text size="sm">{action.description}</Text>

                                                <Group gap="sm">
                                                    <Text size="xs" c="dimmed">
                                                        Responsable: <strong>{action.responsible}</strong>
                                                    </Text>
                                                    {action.dueDate && (
                                                        <Text
                                                            size="xs"
                                                            c={isOverdue(action.dueDate) && action.status === "PENDING"
                                                                ? "red" : "dimmed"}
                                                            fw={isOverdue(action.dueDate) && action.status === "PENDING"
                                                                ? 500 : 400}
                                                        >
                                                            Fecha límite: {new Date(action.dueDate).toLocaleDateString("es")}
                                                            {isOverdue(action.dueDate) && action.status === "PENDING"
                                                                ? " — Vencida" : ""}
                                                        </Text>
                                                    )}
                                                </Group>
                                            </Stack>

                                            <Badge
                                                color={actionStatusConfig[action.status].color}
                                                variant="light"
                                            >
                                                {actionStatusConfig[action.status].label}
                                            </Badge>
                                        </Group>
                                    </Paper>
                                ))}
                            </Stack>
                        )}

                        {/* Resumen */}
                        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm" mt="md">
                            {(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as ActionStatus[]).map(status => (
                                <Paper key={status} withBorder p="md" radius="md" ta="center">
                                    <Text size="xs" c="dimmed" mb={4}>
                                        {actionStatusConfig[status].label}
                                    </Text>
                                    <Text fw={500} size="xl" c={actionStatusConfig[status].color}>
                                        {actions.filter(a => a.status === status).length}
                                    </Text>
                                </Paper>
                            ))}
                        </SimpleGrid>
                    </Stack>
                </Tabs.Panel>
            </Tabs>
        </Stack>
    )
}