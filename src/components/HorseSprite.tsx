import { colorByKey } from '../colors'

interface HorseSpriteProps {
  colorKey: string
  running?: boolean
  size?: number
}

export default function HorseSprite({ colorKey, running = false, size = 56 }: HorseSpriteProps) {
  const c = colorByKey(colorKey)
  return (
    <span
      className="horse-sprite"
      style={{ width: size, height: size, fontSize: size, filter: c.filter }}
      aria-hidden="true"
    >
      <span className={running ? 'horse-sprite-inner horse-sprite-running' : 'horse-sprite-inner'}>🐎</span>
    </span>
  )
}
