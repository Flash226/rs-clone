import { Mix, Rates } from '../components/types/types';

export function sortByRating(a: Mix, b: Mix, allRates?: Rates) {
  if (!allRates) return 0;
  const aRateInArr = allRates.find((rate) => rate.id === a.id)?.rate;
  const bRateInArr = allRates.find((rate) => rate.id === b.id)?.rate;
  const aRate = aRateInArr ? Number(aRateInArr) : 0;
  const bRate = bRateInArr ? Number(bRateInArr) : 0;

  if (bRate > aRate) return 1;
  if (aRate > bRate) return -1;
  return 0;
}

export function sortByPopularity(a: Mix, b: Mix, allRates?: Rates) {
  if (!allRates) return 0;
  const aVotesInArr = allRates.find((rate) => rate.id === a.id)?.votes;
  const bVotesInArr = allRates.find((rate) => rate.id === b.id)?.votes;
  const aVotes = aVotesInArr ? Number(aVotesInArr) : 0;
  const bVotes = bVotesInArr ? Number(bVotesInArr) : 0;

  if (bVotes > aVotes) return 1;
  if (aVotes < bVotes) return -1;
  return 0;
}
