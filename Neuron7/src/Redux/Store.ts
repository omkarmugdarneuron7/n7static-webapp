import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import toastReducer from './Slices/toastSlice'
import intelligentSearchReducer from './Slices/intelligentSearchSlice'
import rootSaga from './Sagas/RootSaga'
const sagaMiddleware = createSagaMiddleware();

const Store = configureStore({
  reducer: {
    toast:  toastReducer,
    intelligentSearch:intelligentSearchReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware),

});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store;
