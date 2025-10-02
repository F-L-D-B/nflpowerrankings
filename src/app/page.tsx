'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import Image from 'next/image'

/** =========================
 * Types & Constants
 * ========================= */
type DivisionKey =
  | 'AFC East'
  | 'AFC North'
  | 'AFC South'
  | 'AFC West'
  | 'NFC East'
  | 'NFC North'
  | 'NFC South'
  | 'NFC West'

type Team = {
  id: string
  name: string
  slug: string
  division: DivisionKey
  shortName?: string
}

const DIVISIONS: DivisionKey[] = [
  'AFC East',
  'AFC North',
  'AFC South',
  'AFC West',
  'NFC East',
  'NFC North',
  'NFC South',
  'NFC West',
]

const LS_KEY = 'powerRankings.v4.bars.4col'
const LS_THEME_KEY = 'powerRankings.theme'

const TEAMS: Team[] = [
  {
    id: 'buf',
    name: 'Buffalo Bills',
    shortName: 'Bills',
    slug: 'bills',
    division: 'AFC East',
  },
  {
    id: 'mia',
    name: 'Miami Dolphins',
    shortName: 'Dolphins',
    slug: 'dolphins',
    division: 'AFC East',
  },
  {
    id: 'ne',
    name: 'New England Patriots',
    shortName: 'Patriots',
    slug: 'patriots',
    division: 'AFC East',
  },
  {
    id: 'nyj',
    name: 'New York Jets',
    shortName: 'Jets',
    slug: 'jets',
    division: 'AFC East',
  },
  {
    id: 'bal',
    name: 'Baltimore Ravens',
    shortName: 'Ravens',
    slug: 'ravens',
    division: 'AFC North',
  },
  {
    id: 'cin',
    name: 'Cincinnati Bengals',
    shortName: 'Bengals',
    slug: 'bengals',
    division: 'AFC North',
  },
  {
    id: 'cle',
    name: 'Cleveland Browns',
    shortName: 'Browns',
    slug: 'browns',
    division: 'AFC North',
  },
  {
    id: 'pit',
    name: 'Pittsburgh Steelers',
    shortName: 'Steelers',
    slug: 'steelers',
    division: 'AFC North',
  },
  {
    id: 'hou',
    name: 'Houston Texans',
    shortName: 'Texans',
    slug: 'texans',
    division: 'AFC South',
  },
  {
    id: 'ind',
    name: 'Indianapolis Colts',
    shortName: 'Colts',
    slug: 'colts',
    division: 'AFC South',
  },
  {
    id: 'jax',
    name: 'Jacksonville Jaguars',
    shortName: 'Jaguars',
    slug: 'jaguars',
    division: 'AFC South',
  },
  {
    id: 'ten',
    name: 'Tennessee Titans',
    shortName: 'Titans',
    slug: 'titans',
    division: 'AFC South',
  },
  {
    id: 'den',
    name: 'Denver Broncos',
    shortName: 'Broncos',
    slug: 'broncos',
    division: 'AFC West',
  },
  {
    id: 'kc',
    name: 'Kansas City Chiefs',
    shortName: 'Chiefs',
    slug: 'chiefs',
    division: 'AFC West',
  },
  {
    id: 'lv',
    name: 'Las Vegas Raiders',
    shortName: 'Raiders',
    slug: 'raiders',
    division: 'AFC West',
  },
  {
    id: 'lac',
    name: 'Los Angeles Chargers',
    shortName: 'Chargers',
    slug: 'chargers',
    division: 'AFC West',
  },
  {
    id: 'dal',
    name: 'Dallas Cowboys',
    shortName: 'Cowboys',
    slug: 'cowboys',
    division: 'NFC East',
  },
  {
    id: 'nyg',
    name: 'New York Giants',
    shortName: 'Giants',
    slug: 'giants',
    division: 'NFC East',
  },
  {
    id: 'phi',
    name: 'Philadelphia Eagles',
    shortName: 'Eagles',
    slug: 'eagles',
    division: 'NFC East',
  },
  {
    id: 'was',
    name: 'Washington Commanders',
    shortName: 'Commanders',
    slug: 'commanders',
    division: 'NFC East',
  },
  {
    id: 'chi',
    name: 'Chicago Bears',
    shortName: 'Bears',
    slug: 'bears',
    division: 'NFC North',
  },
  {
    id: 'det',
    name: 'Detroit Lions',
    shortName: 'Lions',
    slug: 'lions',
    division: 'NFC North',
  },
  {
    id: 'gb',
    name: 'Green Bay Packers',
    shortName: 'Packers',
    slug: 'packers',
    division: 'NFC North',
  },
  {
    id: 'min',
    name: 'Minnesota Vikings',
    shortName: 'Vikings',
    slug: 'vikings',
    division: 'NFC North',
  },
  {
    id: 'atl',
    name: 'Atlanta Falcons',
    shortName: 'Falcons',
    slug: 'falcons',
    division: 'NFC South',
  },
  {
    id: 'car',
    name: 'Carolina Panthers',
    shortName: 'Panthers',
    slug: 'panthers',
    division: 'NFC South',
  },
  {
    id: 'no',
    name: 'New Orleans Saints',
    shortName: 'Saints',
    slug: 'saints',
    division: 'NFC South',
  },
  {
    id: 'tb',
    name: 'Tampa Bay Buccaneers',
    shortName: 'Buccaneers',
    slug: 'buccaneers',
    division: 'NFC South',
  },
  {
    id: 'ari',
    name: 'Arizona Cardinals',
    shortName: 'Cardinals',
    slug: 'cardinals',
    division: 'NFC West',
  },
  {
    id: 'lar',
    name: 'Los Angeles Rams',
    shortName: 'Rams',
    slug: 'rams',
    division: 'NFC West',
  },
  {
    id: 'sf',
    name: 'San Francisco 49ers',
    shortName: '49ers',
    slug: '49ers',
    division: 'NFC West',
  },
  {
    id: 'sea',
    name: 'Seattle Seahawks',
    shortName: 'Seahawks',
    slug: 'seahawks',
    division: 'NFC West',
  },
]

const TEAM_BY_ID = Object.fromEntries(TEAMS.map((t) => [t.id, t])) as Record<
  string,
  Team
>
const IDS_BY_DIVISION = DIVISIONS.reduce<Record<DivisionKey, string[]>>(
  (acc, d) => {
    acc[d] = TEAMS.filter((t) => t.division === d).map((t) => t.id)
    return acc
  },
  {} as Record<DivisionKey, string[]>
)

const AFC_DIVISIONS: DivisionKey[] = [
  'AFC East',
  'AFC North',
  'AFC South',
  'AFC West',
]
const NFC_DIVISIONS: DivisionKey[] = [
  'NFC East',
  'NFC North',
  'NFC South',
  'NFC West',
]

const TOTAL_SLOTS = 32

function loadOrder(): string[] | null {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as string[]) : null
  } catch {
    return null
  }
}

function saveOrder(order: string[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(order))
  } catch {}
}

function loadTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem(LS_THEME_KEY)
    return saved === 'light' || saved === 'dark' ? saved : 'dark'
  } catch {
    return 'dark'
  }
}

function saveTheme(theme: 'light' | 'dark') {
  try {
    localStorage.setItem(LS_THEME_KEY, theme)
  } catch {}
}

export default function PowerRankingsPage() {
  const [order, setOrder] = useState<string[]>(Array(TOTAL_SLOTS).fill(''))
  const [filter, setFilter] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const loaded = loadOrder()
    if (loaded && loaded.length === TOTAL_SLOTS) {
      setOrder(loaded)
    }
    const savedTheme = loadTheme()
    setTheme(savedTheme)
  }, [])

  useEffect(() => {
    saveOrder(order)
  }, [order])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    saveTheme(newTheme)
  }

  const placed = useMemo(() => new Set(order.filter(Boolean)), [order])

  function clearAll() {
    localStorage.removeItem(LS_KEY)
    setOrder(Array(TOTAL_SLOTS).fill(''))
  }

  const dragTeamIdRef = useRef<string | null>(null)
  const dragFromSlotRef = useRef<number | null>(null)

  function onDragStartSource(e: React.DragEvent, teamId: string) {
    dragTeamIdRef.current = teamId
    dragFromSlotRef.current = null
    e.dataTransfer.setData('text/plain', teamId)
    e.dataTransfer.effectAllowed = 'move'
  }

  function onDragStartSlot(e: React.DragEvent, slotIndex: number) {
    const teamId = order[slotIndex]
    if (!teamId) return
    dragTeamIdRef.current = teamId
    dragFromSlotRef.current = slotIndex
    e.dataTransfer.setData('text/plain', teamId)
    e.dataTransfer.effectAllowed = 'move'
  }

  function onDragOverSlot(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function onDropToSlot(e: React.DragEvent, targetIndex: number) {
    e.preventDefault()
    const teamId = dragTeamIdRef.current
    if (!teamId) return

    setOrder((prev) => {
      const next = prev.slice()
      const from = dragFromSlotRef.current
      const targetTeam = next[targetIndex]

      // If dragging from sidebar (from === null)
      if (from === null) {
        // Check if team already exists somewhere, remove it
        const existingIndex = next.findIndex((id) => id === teamId)
        if (existingIndex !== -1) next[existingIndex] = ''

        // Place at target
        next[targetIndex] = teamId
      }
      // If dragging from one slot to another
      else if (from !== targetIndex) {
        // Always swap - put target team at source position
        next[from] = targetTeam
        // Put dragged team at target position
        next[targetIndex] = teamId
      }

      return next
    })

    dragTeamIdRef.current = null
    dragFromSlotRef.current = null
  }

  function removeFromSlot(slotIndex: number) {
    setOrder((prev) => {
      const next = prev.slice()
      next[slotIndex] = ''
      return next
    })
  }

  const grid = useMemo(
    () => order.map((id) => (id ? TEAM_BY_ID[id] : null)),
    [order]
  )
  const filterLower = filter.trim().toLowerCase()

  const isDark = theme === 'dark'

  return (
    <div
      className={`min-h-screen flex ${
        isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* LEFT SIDEBAR */}
      <aside
        className={`w-[600px] border-r overflow-y-auto hidden lg:block ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}
      >
        <div
          className={`sticky top-0 border-b p-6 space-y-4 z-10 ${
            isDark
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className='flex items-center justify-between'>
            <h2
              className={`text-lg font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Team Pool
            </h2>
            <button
              onClick={clearAll}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                isDark
                  ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Clear All
            </button>
          </div>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder='Search teams...'
            className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDark
                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          />
        </div>

        <div className='p-6 grid grid-cols-2 gap-6'>
          {/* AFC Column */}
          <div className='space-y-6'>
            <h2 className='text-sm font-bold text-blue-500 uppercase tracking-wider'>
              AFC
            </h2>
            {AFC_DIVISIONS.map((divKey) => {
              const ids = IDS_BY_DIVISION[divKey]
              const visibleIds = ids.filter((id) => {
                if (!filterLower) return true
                const t = TEAM_BY_ID[id]
                return (
                  t.name.toLowerCase().includes(filterLower) ||
                  t.slug.toLowerCase().includes(filterLower)
                )
              })
              if (visibleIds.length === 0) return null
              return (
                <section key={divKey}>
                  <h3
                    className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {divKey.replace('AFC ', '')}
                  </h3>
                  <div className='space-y-2'>
                    {visibleIds.map((id) => {
                      const t = TEAM_BY_ID[id]
                      const used = placed.has(id)
                      return (
                        <div
                          key={id}
                          draggable={!used}
                          onDragStart={(e) => onDragStartSource(e, id)}
                          className={[
                            'rounded-lg border p-2.5 flex items-center gap-2.5 select-none transition-all',
                            used
                              ? `opacity-40 cursor-not-allowed ${
                                  isDark
                                    ? 'bg-slate-700/50 border-slate-600'
                                    : 'bg-slate-50 border-slate-200'
                                }`
                              : `cursor-grab hover:shadow-md ${
                                  isDark
                                    ? 'bg-slate-700 border-slate-600 hover:border-slate-500'
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                }`,
                          ].join(' ')}
                        >
                          <Image
                            src={`/teamlogos/${t.slug}.png`}
                            alt={t.name}
                            className='h-7 w-7 object-contain flex-shrink-0'
                            onError={(e) => {
                              ;(e.currentTarget as HTMLImageElement).src =
                                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="28" height="28"%3E%3Ctext y="22" font-size="20"%3E🏈%3C/text%3E%3C/svg%3E'
                            }}
                          />
                          <span
                            className={`text-xs font-medium truncate ${
                              isDark ? 'text-slate-200' : 'text-slate-900'
                            }`}
                          >
                            {t.name}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>

          {/* NFC Column */}
          <div className='space-y-6'>
            <h2 className='text-sm font-bold text-red-500 uppercase tracking-wider'>
              NFC
            </h2>
            {NFC_DIVISIONS.map((divKey) => {
              const ids = IDS_BY_DIVISION[divKey]
              const visibleIds = ids.filter((id) => {
                if (!filterLower) return true
                const t = TEAM_BY_ID[id]
                return (
                  t.name.toLowerCase().includes(filterLower) ||
                  t.slug.toLowerCase().includes(filterLower)
                )
              })
              if (visibleIds.length === 0) return null
              return (
                <section key={divKey}>
                  <h3
                    className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {divKey.replace('NFC ', '')}
                  </h3>
                  <div className='space-y-2'>
                    {visibleIds.map((id) => {
                      const t = TEAM_BY_ID[id]
                      const used = placed.has(id)
                      return (
                        <div
                          key={id}
                          draggable={!used}
                          onDragStart={(e) => onDragStartSource(e, id)}
                          className={[
                            'rounded-lg border p-2.5 flex items-center gap-2.5 select-none transition-all',
                            used
                              ? `opacity-40 cursor-not-allowed ${
                                  isDark
                                    ? 'bg-slate-700/50 border-slate-600'
                                    : 'bg-slate-50 border-slate-200'
                                }`
                              : `cursor-grab hover:shadow-md ${
                                  isDark
                                    ? 'bg-slate-700 border-slate-600 hover:border-slate-500'
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                }`,
                          ].join(' ')}
                        >
                          <Image
                            src={`/teamlogos/${t.slug}.png`}
                            alt={t.name}
                            className='h-7 w-7 object-contain flex-shrink-0'
                            onError={(e) => {
                              ;(e.currentTarget as HTMLImageElement).src =
                                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="28" height="28"%3E%3Ctext y="22" font-size="20"%3E🏈%3C/text%3E%3C/svg%3E'
                            }}
                          />
                          <span
                            className={`text-xs font-medium truncate ${
                              isDark ? 'text-slate-200' : 'text-slate-900'
                            }`}
                          >
                            {t.name}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className='flex-1 overflow-y-auto'>
        <div className='max-w-[1800px] mx-auto p-6 lg:p-8'>
          <header className='mb-8 flex items-center justify-between'>
            <div>
              <h1
                className={`text-4xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                NFL Power Rankings
              </h1>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Drag and drop teams to build your rankings
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`rounded-lg border p-3 transition-colors ${
                isDark
                  ? 'border-slate-600 hover:bg-slate-700'
                  : 'border-slate-300 hover:bg-slate-100'
              }`}
              aria-label='Toggle theme'
            >
              {isDark ? (
                <Sun className='h-5 w-5' />
              ) : (
                <Moon className='h-5 w-5' />
              )}
            </button>
          </header>

          <div className='grid grid-cols-4 grid-rows-8 gap-x-16 gap-y-5 grid-flow-col'>
            {Array.from({ length: TOTAL_SLOTS }).map((_, slotIndex) => {
              const team = grid[slotIndex]
              const rankNum = slotIndex + 1
              return (
                <div
                  key={slotIndex}
                  className='flex items-center justify-end'
                  style={{ minHeight: '50px' }}
                >
                  {/* Position Number - Styled Badge */}
                  <div
                    className={`flex items-center justify-center min-w-[60px] h-12 mr-4 rounded-lg font-black text-2xl shadow-lg border-2 ${
                      isDark
                        ? 'bg-gradient-to-br from-slate-700 to-slate-800 text-white border-slate-600'
                        : 'bg-gradient-to-br from-white to-slate-50 text-slate-900 border-slate-300'
                    }`}
                  >
                    {rankNum}
                  </div>

                  {/* Droppable Area */}
                  <div
                    onDragOver={onDragOverSlot}
                    onDrop={(e) => onDropToSlot(e, slotIndex)}
                    className={`w-72 h-12 rounded-lg overflow-hidden transition-all ${
                      isDark
                        ? 'bg-white/10 hover:bg-white/20'
                        : 'bg-slate-900/10 hover:bg-slate-900/20'
                    }`}
                    style={{
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    {team ? (
                      <div
                        draggable
                        onDragStart={(e) => onDragStartSlot(e, slotIndex)}
                        className='cursor-grab active:cursor-grabbing h-full group'
                      >
                        <div className='relative h-full'>
                          <Image
                            src={`/teamrankingbars/${team.slug}_Ranking.png`}
                            alt={team.name}
                            className='absolute inset-0 w-full h-full object-cover'
                            onError={(e) => {
                              ;(
                                e.currentTarget as HTMLImageElement
                              ).style.display = 'none'
                            }}
                          />
                          <div className='absolute inset-0 flex items-center justify-between px-3 gap-2'>
                            <div className='flex items-center gap-2 flex-1 min-w-0'>
                              <Image
                                src={`/teamlogos/${team.slug}.png`}
                                alt={team.name}
                                className='h-9 w-9 object-contain flex-shrink-0 drop-shadow-xl'
                                onError={(e) => {
                                  ;(e.currentTarget as HTMLImageElement).src =
                                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="36" height="36"%3E%3Ctext y="29" font-size="28"%3E🏈%3C/text%3E%3C/svg%3E'
                                }}
                              />
                              <span className='text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] truncate'>
                                {team.shortName || team.name}
                              </span>
                            </div>
                            <button
                              onClick={(ev) => {
                                ev.stopPropagation()
                                removeFromSlot(slotIndex)
                              }}
                              className='h-7 w-7 rounded-lg flex items-center justify-center transition-all flex-shrink-0 font-bold text-lg bg-black/80 backdrop-blur-sm text-white hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100'
                              aria-label='Remove'
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className='h-full flex items-center justify-center'>
                        <div
                          className={`text-xs ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          Drop team here
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
