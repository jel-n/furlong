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
      <path
        d="M28 20 C16 14, 6 18, 4 28 C3 36, 8 44, 16 46 C10 40, 8 32, 12 26 C16 20, 22 20, 28 20 Z"
        fill={c.mane}
      />
      {/* hind legs */}
      <g className="leg leg-back-1">
        <rect x="22" y="34" width="7" height="28" rx="2" fill={c.bodyShade} />
        <rect x="21" y="59" width="9" height="5" rx="1.5" fill={c.mane} />
      </g>
      <g className="leg leg-back-2">
        <rect x="35" y="36" width="7" height="27" rx="2" fill={c.body} />
        <rect x="34" y="60" width="9" height="5" rx="1.5" fill={c.mane} />
      </g>
      {/* torso */}
      <path
        d="M22 34 C19 27, 21 19, 30 16 C40 13, 55 13, 62 16 C66 18, 66 24, 64 28 C64 34, 62 40, 56 42 C46 44, 34 44, 26 42 C22 40, 21 37, 22 34 Z"
        fill={c.body}
      />
      {/* front legs */}
      <g className="leg leg-front-2">
        <rect x="53" y="32" width="7" height="30" rx="2" fill={c.bodyShade} />
        <rect x="52" y="59" width="9" height="5" rx="1.5" fill={c.mane} />
      </g>
      <g className="leg leg-front-1">
        <rect x="64" y="30" width="7" height="31" rx="2" fill={c.body} />
        <rect x="63" y="58" width="9" height="5" rx="1.5" fill={c.mane} />
      </g>
      {/* neck + head */}
      <path
        d="M62 16 C68 8, 76 4, 84 5 C88 6, 90 9, 90 13 C93 14, 96 17, 98 20 C99 22, 99 24, 97 26 C92 28, 84 27, 78 23 C76 21, 76 20, 76 19 C72 19, 68 19, 64 21 C63 19, 62 17, 62 16 Z"
        fill={c.body}
      />
      {/* mane */}
      <path
        d="M62 16 C66 10, 70 6, 76 4 C80 3, 84 3, 88 6 C83 6, 78 7, 74 9 C70 11, 66 14, 63 18 Z"
        fill={c.mane}
      />
      {/* ears */}
      <path d="M85 6 L86 1 L89 5 Z" fill={c.bodyShade} />
      <path d="M89 6 L92 0 L94 6 Z" fill={c.body} />
      {/* eye + nostril */}
      <circle cx="91" cy="13" r="1.4" fill={c.mane} />
      <ellipse cx="96" cy="22" rx="2" ry="1.5" fill={c.mane} />
    </svg>
  )
}
