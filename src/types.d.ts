import { FC } from 'react';
import { Credential, Presentation } from '@unumid/types';
import { DemoPresentationDto } from '@unumid/demo-types';

import {
  Presentation as DeprecatedPresentation,
  NoPresentation as DeprecatedNoPresentation
} from '@unumid/types-deprecated';

import {
  DemoPresentationDto as DeprecatedDemoPresentationDto,
  DemoNoPresentationDto as DeprecatedDemoNoPresentationDto
} from '@unumid/demo-types-deprecated';

// eslint-disable-next-line @typescript-eslint/ban-types
export type FCWithClassName<P = {}> = FC<P & { className?: string }>;

// type of the object returned when authenticating with the issuer server
export interface DemoUserAuthenticationResult {
  accessToken: string;
  authentication: {
    strategy: string,
    accessToken: string;
    payload: {
      iat: number;
      exp: number;
      aud: string;
      iss: string;
      sub: string;
      jti: string;
    }
  },
  user: DemoUser
}

export interface DeclinedPresentation extends Presentation {
  verifiableCredential?: never[];
}

export interface AcceptedPresentation extends Presentation {
  verifiableCredential: Credential[];
}

export interface DemoAcceptedPresentationDto extends DemoPresentationDto {
  presentation: AcceptedPresentation;
}

export interface DemoDeclinedPresentationDto extends DemoPresentationDto {
  presentation: DeclinedPresentation;
}

export type PresentationLike = Presentation | DeprecatedPresentation | DeprecatedNoPresentation;

export type DemoPresentationLikeDto = DemoPresentationDto | DeprecatedDemoNoPresentationDto | DeprecatedDemoPresentationDto;
