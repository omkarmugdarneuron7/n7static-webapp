
import intelligentSearchSaga from './intelligentSearchSaga';
export default function* rootSaga() {
  yield* intelligentSearchSaga();
}