import { DrawSimulationResult } from '@/types';

export function generateRandomDraw(): number[] {
  const numbers = new Set<number>();
  while (numbers.size < 5) {
    const randomNum = Math.floor(Math.random() * 45) + 1;
    numbers.add(randomNum);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

export function generateAlgorithmicDraw(allUserScores: number[][]): number[] {
  const frequencies = new Map<number, number>();
  for (let i = 1; i <= 45; i++) frequencies.set(i, 0);

  for (const scores of allUserScores) {
    for (const score of scores) {
      if (score >= 1 && score <= 45) {
        frequencies.set(score, frequencies.get(score)! + 1);
      }
    }
  }

  let maxFreq = 0;
  for (const count of Array.from(frequencies.values())) {
    if (count > maxFreq) maxFreq = count;
  }

  const weights: { number: number; weight: number }[] = [];
  for (let i = 1; i <= 45; i++) {
    const freq = frequencies.get(i)!;
    weights.push({ number: i, weight: (maxFreq - freq) + 1 });
  }

  const drawn = new Set<number>();
  while (drawn.size < 5) {
    const totalWeight = weights.filter(w => !drawn.has(w.number)).reduce((sum, w) => sum + w.weight, 0);
    let random = Math.random() * totalWeight;
    for (const w of weights) {
      if (drawn.has(w.number)) continue;
      random -= w.weight;
      if (random <= 0) { drawn.add(w.number); break; }
    }
  }

  return Array.from(drawn).sort((a, b) => a - b);
}

export function checkUserMatch(userScores: number[], drawnNumbers: number[]): { matched: number[]; count: number } {
  const drawnSet = new Set(drawnNumbers);
  const matched = userScores.filter(score => drawnSet.has(score)).sort((a, b) => a - b);
  return { matched, count: matched.length };
}

export function calculatePrizeSplit(poolAmount: number, winnerCount: number): number {
  if (winnerCount === 0 || poolAmount <= 0) return 0;
  return Math.floor(poolAmount / winnerCount);
}

export function runDrawEngine(
  allUserScores: { userId: string; scores: number[] }[],
  totalPool: number,
  previousJackpot: number,
  drawType: 'random' | 'algorithmic'
): DrawSimulationResult {
  let drawnNumbers: number[];
  if (drawType === 'algorithmic') {
    drawnNumbers = generateAlgorithmicDraw(allUserScores.map(u => u.scores));
  } else {
    drawnNumbers = generateRandomDraw();
  }

  const jackpotPool = (totalPool * 0.40) + previousJackpot;
  const match4Pool = totalPool * 0.35;
  const match3Pool = totalPool * 0.25;

  const winners5: { userId: string; matchedNumbers: number[]; prize: number }[] = [];
  const winners4: { userId: string; matchedNumbers: number[]; prize: number }[] = [];
  const winners3: { userId: string; matchedNumbers: number[]; prize: number }[] = [];

  for (const user of allUserScores) {
    const matchResult = checkUserMatch(user.scores, drawnNumbers);
    if (matchResult.count >= 5) {
      winners5.push({ userId: user.userId, matchedNumbers: matchResult.matched, prize: 0 });
    } else if (matchResult.count === 4) {
      winners4.push({ userId: user.userId, matchedNumbers: matchResult.matched, prize: 0 });
    } else if (matchResult.count === 3) {
      winners3.push({ userId: user.userId, matchedNumbers: matchResult.matched, prize: 0 });
    }
  }

  const prize5 = calculatePrizeSplit(jackpotPool, winners5.length);
  const prize4 = calculatePrizeSplit(match4Pool, winners4.length);
  const prize3 = calculatePrizeSplit(match3Pool, winners3.length);

  for (const w of winners5) w.prize = prize5;
  for (const w of winners4) w.prize = prize4;
  for (const w of winners3) w.prize = prize3;

  const jackpotRolledOver = winners5.length === 0;

  // Build flat results array for DB insertion
  const results = [
    ...winners5.map(w => ({ userId: w.userId, matchedNumbers: w.matchedNumbers, matchCount: 5, prizeAmount: w.prize })),
    ...winners4.map(w => ({ userId: w.userId, matchedNumbers: w.matchedNumbers, matchCount: 4, prizeAmount: w.prize })),
    ...winners3.map(w => ({ userId: w.userId, matchedNumbers: w.matchedNumbers, matchCount: 3, prizeAmount: w.prize })),
    // Users with 0-2 matches still need a result row (0 prize)
    ...allUserScores
      .filter(u => ![...winners5, ...winners4, ...winners3].some(w => w.userId === u.userId))
      .map(u => {
        const m = checkUserMatch(u.scores, drawnNumbers);
        return { userId: u.userId, matchedNumbers: m.matched, matchCount: m.count, prizeAmount: 0 };
      }),
  ];

  return {
    drawnNumbers,
    winners5,
    winners4,
    winners3,
    jackpotRolledOver,
    pools: { jackpot: jackpotPool, match4: match4Pool, match3: match3Pool, total: totalPool },
    // Convenience fields for the UI
    prizePool: totalPool,
    jackpotRollover: jackpotRolledOver ? jackpotPool : 0,
    results,
    tierWinners: { match5: winners5.length, match4: winners4.length, match3: winners3.length },
    payoutPerWinner: { match5: prize5, match4: prize4, match3: prize3 },
  };
}
