export interface HorseColor {
  key: string
  label: string
  filter: string
}

export const PALETTE: HorseColor[] = [
  { key: 'bay', label: 'Bay', filter: 'hue-rotate(-8deg) saturate(1.5) brightness(0.68)' },
  { key: 'chestnut', label: 'Chestnut', filter: 'hue-rotate(-4deg) saturate(1.6) brightness(0.92)' },
  { key: 'black', label: 'Black', filter: 'brightness(0.25) saturate(1)' },
  { key: 'darkbay', label: 'Dark Bay/Brown', filter: 'hue-rotate(-10deg) saturate(1.3) brightness(0.42)' },
  { key: 'gray', label: 'Gray/Grey', filter: 'saturate(0.12) brightness(1.05)' },
  { key: 'palomino', label: 'Palomino', filter: 'hue-rotate(6deg) saturate(1.2) brightness(1.12)' },
  { key: 'buckskin', label: 'Buckskin', filter: 'hue-rotate(10deg) saturate(0.85) brightness(1.0)' },
  { key: 'white', label: 'White/Cremello', filter: 'saturate(0.06) brightness(1.6) contrast(0.85)' },
]

export function colorByKey(key: string): HorseColor {
  return PALETTE.find((c) => c.key === key) ?? PALETTE[0]
}

export function defaultColorKeyForIndex(i: number): string {
  return PALETTE[i % PALETTE.length].key
}
