import type { Solution } from "@/types/solution"

export const filterFields = ["status", "criticality", "role", "usageStatus", "hostingMode", "managementModel", "supportStatus", "hasProblems", "hasReplacementInitiative"] as const
export type SolutionFiltersState = { search: string } & Record<typeof filterFields[number], string[]>

export function emptySolutionFilters(): SolutionFiltersState {
  return { search: "", status: [], criticality: [], role: [], usageStatus: [], hostingMode: [], managementModel: [], supportStatus: [], hasProblems: [], hasReplacementInitiative: [] }
}

export function filterSolutions(solutions: Solution[], filters: SolutionFiltersState): Solution[] {
  const search = filters.search.trim().toLocaleLowerCase()
  return solutions.filter(solution => {
    const textMatches = !search || [solution.name, solution.description, solution.vendor, solution.owner, solution.businessProcess, solution.knownDependencies, solution.problemDetails, ...(solution.userGroups ?? [])]
      .some(value => value?.toLocaleLowerCase().includes(search))
    return textMatches && filterFields.every(field => {
      const selected = filters[field]
      const value = solution[field]
      return selected.length === 0 || selected.includes(value == null ? "" : String(value))
    })
  })
}
