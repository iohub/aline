export type SystemPrompt = {
	id: string
	name: string
	prompt: string
}

export const CLINE_SYSTEM_PROMPT: SystemPrompt = {
	id: "cline",
	name: "cline",
	prompt: "default",
}