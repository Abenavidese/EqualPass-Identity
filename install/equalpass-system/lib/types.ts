export interface EligibilityResponse {
  sessionId: string
  eligible: boolean
}

export interface WebAuthnResponse {
  ok: boolean
}

export interface ClaimResponse {
  auth: string
}

export interface BadgeInfo {
  badgeType: number
  issuedAt: bigint
  issuer: string
}

export type BadgeType = 1 | 2 | 3

export const BADGE_TYPE_LABELS: Record<BadgeType, string> = {
  1: "Estudiante Verificado",
  2: "Estudiante Premium",
  3: "Estudiante Avanzado",
}
