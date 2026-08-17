import type { RaceResultEntry } from '../types'
import HorseSprite from '../components/HorseSprite'
import Confetti from '../components/Confetti'

function displayName(h: RaceResultEntry['horse']): string {
  return h.name.trim() || `Horse ${h.number}`
}

const ORDINALS: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd' }
function ordinal(place: number): string {
  return ORDINALS[place] ?? `${place}th`
}

interface ResultsScreenProps {
  results: RaceResultEntry[]
  onRaceAgain: () => void
  onNewRace: () => void
}

export default function ResultsScreen({ results, onRaceAgain, onNewRace }: ResultsScreenProps) {
  const winner = results.find((r) => r.place === 1)

  return (
    <div className="screen results-screen">
      {winner && <Confetti />}
      <header className="results-header">
        <p className="winner-kicker">🏆 Winner</p>
        {winner && (
          <div className="winner-banner">
            <HorseSprite colorKey={winner.horse.colorKey} size={72} />
            <h1>
              #{winner.horse.number} {displayName(winner.horse)}
            </h1>
          </div>
        )}
      </header>

      <ol className="results-list">
        {results.map((r) => (
          <li key={r.horse.id} className={`results-row ${r.place === 1 ? 'first-place' : ''}`}>
            <span className="results-place">{ordinal(r.place)}</span>
            <HorseSprite colorKey={r.horse.colorKey} size={36} />
            <span className="results-name">
              #{r.horse.number} {displayName(r.horse)}
            </span>
            <span className="results-time">
              {r.finishTimeSec !== null ? `${r.finishTimeSec.toFixed(2)}s` : 'DNF'}
            </span>
          </li>
        ))}
      </ol>

      <footer className="results-footer">
        <button className="secondary-btn" onClick={onNewRace}>
          New Race
        </button>
        <button className="start-btn" onClick={onRaceAgain}>
          Race Again 🔁
        </button>
      </footer>
    </div>
  )
}
