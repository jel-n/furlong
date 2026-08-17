import { colorByKey } from '../colors'

interface HorseSpriteProps {
  colorKey: string
  running?: boolean
  size?: number
}

export default function HorseSprite({ colorKey, running = false, size = 56 }: HorseSpriteProps) {
  const c = colorByKey(colorKey)
  return (
    <svg
      className={running ? 'horse-sprite horse-sprite-running' : 'horse-sprite'}
      width={size}
      height={size * 0.72}
      viewBox="0 0 100 72"
      aria-hidden="true"
    >
      {/* tail */}
      <path d="M10 30 C0 26, 0 42, 8 46 C4 40, 6 34, 12 33 Z" fill={c.mane} />
      {/* hind leg back */}
      <rect x="20" y="46" width="7" height="22" rx="2.5" fill={c.bodyShade} className="leg leg-back-1" />
      <rect x="66" y="46" width="7" height="22" rx="2.5" fill={c.bodyShade} className="leg leg-front-1" />
      {/* body */}
      <path
        d="M14 34 C14 20, 30 14, 46 15 C60 16, 66 12, 78 16 C86 19, 88 28, 84 34 C90 34, 92 30, 96 32 C93 38, 87 40, 80 39 L78 46 C70 44, 40 44, 24 42 L18 44 Z"
        fill={c.body}
      />
      {/* front legs */}
      <rect x="30" y="42" width="7" height="26" rx="2.5" fill={c.body} className="leg leg-back-2" />
      <rect x="74" y="40" width="7" height="28" rx="2.5" fill={c.body} className="leg leg-front-2" />
      {/* neck + head */}
      <path
        d="M78 16 C84 10, 84 4, 92 3 C90 8, 88 10, 90 14 C93 16, 96 20, 94 26 C91 22, 87 22, 84 25 C80 22, 78 20, 78 16 Z"
        fill={c.body}
      />
      {/* mane */}
      <path
        d="M46 15 C50 10, 58 8, 66 10 C72 12, 78 14, 82 18 C76 16, 68 15, 62 16 C54 17, 50 18, 46 21 Z"
        fill={c.mane}
      />
      {/* ear */}
      <path d="M89 4 L93 -1 L94 6 Z" fill={c.body} />
      {/* muzzle */}
      <ellipse cx="93" cy="15" rx="4" ry="3" fill={c.bodyShade} />
    </svg>
  )
}
