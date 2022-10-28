import { FC, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { CredentialRequest, PresentationRequestDto } from '@unumid/types';
import { DemoPresentationRequestCreateOptions } from '@unumid/demo-types';
import UnumIDWidget from '@unumid/web-sdk-react';

import { config } from '../config';

import { useActionCreators } from '../hooks/useActionCreators';
import { useTypedSelector } from '../hooks/useTypedSelector';

import MainContent from './Layout/MainContent';
import ContentBox from './Layout/ContentBox';

import './Authentication.css';

import { verifierClient } from '../feathers';
import {
  isDemoAcceptedPresentationDto,
  isDemoDeclinedPresentationDto,
  isDemoPresentationDto,
  isDeprecatedDemoNoPresentationDto,
  isDeprecatedDemoPresentationDto
} from '../typeguards';
import { DemoPresentationLikeDto } from '../types';

const Authentication: FC = () => {
  const {
    createPresentationRequest,
    handleDeprecatedPresentationShared,
    handleNoPresentationShared,
    handleAcceptedPresentationShared,
    handleDeclinedPresentationShared
  } = useActionCreators();

  const history = useHistory();
  const { session } = useTypedSelector(state => state.session);
  const { request } = useTypedSelector(state => state.presentationRequest);
  const { loggedInUser } = useTypedSelector(state => state.auth);

  const actuallyCreatePresentationRequest = async () => {
    if (!session) return;

    // customize these values for the specific demo (or not)
    const credentialRequests: CredentialRequest[] = [{
      type: 'DemoAuthCredential',
      required: true,
      issuers: [config.issuerDid]
    }, {
      type: 'EmailCredential',
      required: true,
      issuers: [config.issuerDid]
    }];

    const presentationRequestOptions: DemoPresentationRequestCreateOptions = {
      credentialRequests,
      metadata: { fields: { sessionUuid: session.uuid } },
      holderAppUuid: config.holderAppUuid
    };

    createPresentationRequest(presentationRequestOptions);
  };

  useEffect(() => {
    actuallyCreatePresentationRequest();
  }, [session]);

  useEffect(() => {
    if (!request?.presentationRequestPostDto) {
      return;
    }

    // now that we've created the request, listen for a presentation
    const presentationService = verifierClient.service('presentationWebsocket');
    presentationService.on('created', async (data: DemoPresentationLikeDto) => {
      console.log('on presentation created, data', data);

      // handle current cases
      if (isDemoPresentationDto(data)) {
        console.log('is a DemoPresentationDto');
        // handle accepted
        if (isDemoAcceptedPresentationDto(data)) {
          console.log('is an accepted DemoPresentationDto');
          await handleAcceptedPresentationShared(data);

          history.push('/authenticated');
        }

        // handle declined
        if (isDemoDeclinedPresentationDto(data)) {
          console.log('is a declined DemoPresentationDto');
          handleDeclinedPresentationShared(data);
          history.push('/declined');
        }
      }

      console.log('is a deprecated DemoPresentationDto');

      // handle deprecated presentation
      if (isDeprecatedDemoPresentationDto(data)) {
        console.log('is an accepted deprecated DemoPresentationDto');
        await handleDeprecatedPresentationShared(data);

        history.push('/authenticated');
      }

      // handle deprecated noPresentation
      if (isDeprecatedDemoNoPresentationDto(data)) {
        console.log('is a deprecated declined DemoPresentationDto');
        handleNoPresentationShared(data);

        history.push('/declined');
      }
    });

    return () => {
      presentationService.removeAllListeners();
    };
  }, [request?.presentationRequestPostDto]);

  const goToLogin = () => {
    console.log('goToLogin');
    history.push('/login');
  };

  if (!session) return null;

  console.log('loggedInUser', loggedInUser);

  const userInfo = loggedInUser && {
    email: loggedInUser.email,
    phone: loggedInUser.phone,
    pushToken: loggedInUser.pushTokens?.map(pt => ({ provider: pt.provider, value: pt.value }))
  };

  return (
    <div className='authentication'>
      <MainContent>
        <ContentBox>
          <UnumIDWidget
            env={config.env}
            apiKey={config.apiKey}
            presentationRequest={request?.presentationRequestPostDto as PresentationRequestDto}
            createPresentationRequest={actuallyCreatePresentationRequest}
            goToLogin={goToLogin}
            userInfo={userInfo || undefined}
            createInitialPresentationRequest={false}
            userCode={loggedInUser?.userCode}
            notUsingUnumWebWalletHolderApp={!config.usingWebWallet}
          />
        </ContentBox>
      </MainContent>

    </div>
  );
};

export default Authentication;
