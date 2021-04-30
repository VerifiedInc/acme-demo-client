import {
  DemoPresentationDto as DeprecatedDemoPresentationDto,
  DemoNoPresentationDto as DeprecatedDemoNoPresentationDto
} from '@unumid/demo-types-deprecated';

import { PresentationActionType } from '../actionTypes/presentation';
import { ActionWithoutPayload, ActionWithPayload, FeathersErrorAction } from './base';

export type PresentationSharedSuccessAction = ActionWithPayload<
  PresentationActionType.PRESENTATION_SHARED_SUCCESS,
  DeprecatedDemoPresentationDto
>;

export type NoPresentationSharedSuccessAction = ActionWithPayload<
  PresentationActionType.NOPRESENTATION_SHARED_SUCCESS,
  DeprecatedDemoNoPresentationDto
>;

export type PresentationSharedErrorAction = FeathersErrorAction<PresentationActionType.PRESENTATION_SHARED_ERROR>;

export type ResetPresentationStateAction = ActionWithoutPayload<PresentationActionType.RESET_PRESENTATION_STATE>;

export type PresentationAction = PresentationSharedSuccessAction
  | NoPresentationSharedSuccessAction
  | PresentationSharedErrorAction
  | ResetPresentationStateAction;
