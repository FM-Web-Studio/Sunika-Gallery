import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './app';

// Hearts and ratings go through the voteArtwork function (Sunika-Portfolio repo), which needs a
// fresh single-use App Check token for each call and limits votes per network.
const vote = (data) => httpsCallable(getFunctions(app, 'europe-west1'), 'voteArtwork', { limitedUseAppCheckTokens: true })(data);

// A limit reached becomes a friendly message instead of a generic failure.
export const voteError = (err) => {
  if (err?.code === 'functions/resource-exhausted') {
    const friendly = new Error('Lots of votes from your network right now. Try again a little later.');
    friendly.code = 'vote-limit';
    return friendly;
  }
  return err;
};

export default vote;
