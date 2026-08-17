export interface HorseConfig {
  id: string
  number: number
  name: string
  colorKey: string
}

export interface RaceSettings {
  durationSeconds: number
}

export interface RaceResultEntry {
  horse: HorseConfig
  place: number
  finishTimeSec: number | null
  finalPositionPct: number
}
