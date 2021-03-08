import { Dispatch } from 'redux';

import { resetSessionState } from './session';
import { resetPresentationState } from './presentation';
import { resetPresentationRequestState } from './presentationRequest';
import { resetUserState } from './user';

export * from './session';
export * from './presentationRequest';
export * from './presentation';
export * from './user';

export const resetState = () => (dispatch: Dispatch): void => {
  dispatch(resetPresentationState());
  dispatch(resetPresentationRequestState());
  dispatch(resetSessionState());
  dispatch(resetUserState());
};
