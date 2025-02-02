// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Stack, TextField, PrimaryButton, Theme, ThemeContext, createTheme } from '@fluentui/react';
import { Header } from '../Header';
import { AppConfigModel } from '../models/ConfigModel';
import { backgroundStyles } from '../styles/Common.styles';
import { formStyles } from '../styles/JoinTeamsMeeting.Styles';
import { getCurrentMeetingURL, isValidTeamsLink, makeTeamsJoinUrl } from '../utils/GetMeetingLink';
import GenericContainer from './GenericContainer';

interface JoinTeamsMeetingProps {
  config: AppConfigModel;
  onJoinMeeting(urlToJoin: string): void;
}

interface JoinTeamsMeetingState {
  teamsMeetingLink: string;
}

export class JoinTeamsMeeting extends React.Component<JoinTeamsMeetingProps, JoinTeamsMeetingState> {
  public constructor(props: JoinTeamsMeetingProps) {
    super(props);

    this.state = {
      teamsMeetingLink: getCurrentMeetingURL(window.location.search)
    };
  }

  private onTeamsMeetingLinkChange(
    _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ): void {
    if (newValue) {
      this.setState({ teamsMeetingLink: newValue });
    } else {
      this.setState({ teamsMeetingLink: '' });
    }
  }

  private onGetErrorMessage(value: string): string {
    if (isValidTeamsLink(value) || value === '') {
      return '';
    }

    return 'This meeting link is invalid. Verify your meeting link URL.';
  }

  render(): JSX.Element {
    const link = makeTeamsJoinUrl(this.state.teamsMeetingLink);
    const enableButton = isValidTeamsLink(this.state.teamsMeetingLink);
    const parentID = 'JoinTeamsMeetingSection';

    return (
      <ThemeContext.Consumer>
        {(theme: Theme | undefined) => {
          if (theme === undefined) {
            theme = createTheme();
          }
          return (
            <Stack styles={backgroundStyles(theme)}>
              <Header companyName={this.props.config.companyName} parentid={parentID} />
              <GenericContainer layerHostId={parentID} theme={theme}>
                <TextField
                  label="Join a call"
                  placeholder="Enter a meeting link"
                  styles={formStyles}
                  iconProps={{ iconName: 'Link' }}
                  onChange={this.onTeamsMeetingLinkChange.bind(this)}
                  onGetErrorMessage={this.onGetErrorMessage.bind(this)}
                  defaultValue={this.state.teamsMeetingLink}
                />
                <PrimaryButton
                  disabled={!enableButton}
                  styles={formStyles}
                  text={'Join call'}
                  onClick={() => this.props.onJoinMeeting(link)}
                />
              </GenericContainer>
            </Stack>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
