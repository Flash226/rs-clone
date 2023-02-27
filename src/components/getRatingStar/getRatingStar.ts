import ratingStarIconSrc from '../../assets/images/star-empty.svg';
import ratingGoldStarIconSrc from '../../assets/images/star-gold.svg';
import { Rates } from '../types/types';
import ProfileUser from '../../components/profile_user/profile_user';

export default function getRatingStar(id: number) {
  const profileUser = new ProfileUser();
  const idProfile = profileUser.getUserId();
  const checkRatesStartinLS = localStorage.getItem('blenderStartProfile');
  const checkRatesinLS = localStorage.getItem('blenderProfile');
  if (checkRatesinLS) {
    if (idProfile !== false && idProfile.length > 12) {
      const getRates = (<Rates>JSON.parse(checkRatesinLS).rating).map((e) => e.id);
      if (getRates.includes(id)) {
        return ratingGoldStarIconSrc;
      } else {
        return ratingStarIconSrc;
      }
    }
  } else if (checkRatesStartinLS) {
    const getRates = (<Rates>JSON.parse(checkRatesStartinLS).rating).map((e) => e.id);
    if (getRates.includes(id)) {
      return ratingGoldStarIconSrc;
    } else {
      return ratingStarIconSrc;
    }
  }
}
