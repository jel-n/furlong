export interface HorseColor {
  key: string
  label: string
  body: string
  bodyShade: string
  mane: string
}

export const PALETTE: HorseColor[] = [
  { key: 'bay', label: 'Bay', body: '#7b4326', bodyShade: '#5f3319', mane: '#211712' },
  { key: 'chestnut', label: 'Chestnut', body: '#9a5330', bodyShade: '#7a4025', mane: '#6b3820' },
  { key: 'black', label: 'Black', body: '#221e1c', bodyShade: '#141110', mane: '#0a0908' },
  { key: 'darkbay', label: 'Dark Bay/Brown', body: '#4a2f22', bodyShade: '#33201780', mane: '#130e0b' },
  { key: 'gray', label: 'Gray/Grey', body: '#9b9a92', bodyShade: '#7c7b74', mane: '#57564f' },
  { key: 'palomino', label: 'Palomino', body: '#cc9c46', bodyShade: '#ad7f34', mane: '#f2e6cc' },
  { key: 'buckskin', label: 'Buckskin', body: '#c2a06b', bodyShade: '#a3844f', mane: '#2a211a' },
  { key: 'white', label: 'White/Cremello', body: '#ece3cd', bodyShade: '#d8cbab', mane: '#cdbfa0' },
]

export function colorByKey(key: string): HorseColor {
  return PALETTE.find((c) => c.key === key) ?? PALETTE[0]
}

export function defaultColorKeyForIndex(i: number): string {
  return PALETTE[i % PALETTE.length].key
}
