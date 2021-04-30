import { DemoPresentationDto } from '@unumid/demo-types';
import {
  DemoPresentationDto as DeprecatedDemoPresentationDto,
  DemoNoPresentationDto as DeprecatedDemoNoPresentationDto
} from '@unumid/demo-types-deprecated';
import { Presentation } from '@unumid/types';
import {
  NoPresentation as DeprecatedNoPresentation,
  Presentation as DeprecatedPresentation
} from '@unumid/types-deprecated';

import {
  AcceptedPresentation,
  DeclinedPresentation,
  DemoAcceptedPresentationDto,
  DemoDeclinedPresentationDto,
  DemoPresentationLikeDto,
  PresentationLike
} from './types';

export function isAcceptedPresentation (presentation: Presentation): presentation is AcceptedPresentation {
  return !!(presentation.verifiableCredential && presentation.verifiableCredential.length > 0);
}

export function isDeclinedPresentation (presentation: Presentation): presentation is DeclinedPresentation {
  return !!(!presentation.verifiableCredential || presentation.verifiableCredential.length === 0);
}

export function isDemoAcceptedPresentationDto (dto: DemoPresentationDto): dto is DemoAcceptedPresentationDto {
  return isAcceptedPresentation(dto.presentation);
}

export function isDemoDeclinedPresentationDto (dto: DemoPresentationDto): dto is DemoDeclinedPresentationDto {
  return isDeclinedPresentation(dto.presentation);
}

export function isDeprecatedNoPresentation (presentationLike: PresentationLike): presentationLike is DeprecatedNoPresentation {
  // unique among PresentationLike objects, the deprecated NoPresentation will always have 'NoPresentation' as the first element in its type array.
  return (presentationLike as DeprecatedNoPresentation).type[0] === 'NoPresentation';
}

export function isDeprecatedPresentation (presentationLike: PresentationLike): presentationLike is DeprecatedPresentation {
  // if it's a DeprecatedNoPresentation, it's not a DeprecatedPresentation
  if (isDeprecatedNoPresentation(presentationLike)) {
    return false;
  }

  // the DeprecatedPresentation always includes a plural verifiableCredentials property
  if ((presentationLike as DeprecatedPresentation).verifiableCredentials) {
    return true;
  }

  return false;
}

export function isPresentation (presentationLike: PresentationLike): presentationLike is Presentation {
  // if it's a DeprecatedNoPresentation, it's not a Presentation
  if (isDeprecatedNoPresentation(presentationLike)) {
    return false;
  }

  // if it's a DeprecatedPresentation, it's not a Presentation
  if (isDeprecatedPresentation(presentationLike)) {
    return false;
  }

  return true;
}

export function isDeprecatedDemoNoPresentationDto (dto: DemoPresentationLikeDto): dto is DeprecatedDemoNoPresentationDto {
  // only the DeprecatedDemoNoPresentationDto has a noPresentation property
  return !!(dto as DeprecatedDemoNoPresentationDto).noPresentation;
}

export function isDeprecatedDemoPresentationDto (dto: DemoPresentationLikeDto): dto is DeprecatedDemoPresentationDto {
  // if it's a DeprecatedDemoNoPresentationDto it's not a DeprecatedDemoPresentationDto
  if (isDeprecatedDemoNoPresentationDto(dto)) {
    return false;
  }

  // if the presentation property is a DeprecatedPresentation, it's a DeprecatedDemoPresentationDto
  return isDeprecatedPresentation(dto.presentation);
}

export function isDemoPresentationDto (dto: DemoPresentationLikeDto): dto is DemoPresentationDto {
  // if it's a DeprecatedDemoNoPresentationDto it's not a DemoPresentationDto
  if (isDeprecatedDemoNoPresentationDto(dto)) {
    return false;
  }

  // if the presentation property is a Presentation, it's a DemoPresentationDto
  return isPresentation(dto.presentation);
}
