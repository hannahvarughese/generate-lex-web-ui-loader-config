export const connectInfo = {
  contactFlowId: "",
  instanceId: "",
  apiGatewayEndpoint: "",
  promptForNameMessage:
    "Before starting a live chat, please tell me your name?",
  waitingForAgentMessage:
    "Thanks for waiting. An agent will be with you when available.",
  waitingForAgentMessageIntervalSeconds: "60",
  agentJoinedMessage: "{Agent} has joined.",
  agentLeftMessage: "{Agent} has left.",
  chatEndedMessage: "Chat ended.",
  attachChatTranscript: "false",
  liveChatTerms: "live chat",
};

export const ui = {
  pageTitle: "sp1bot_qnabot",
  parentOrigin: "",
  toolbarTitle: "Support Predict",
  toolbarLogo:
    "https://welcomecenter.devicebits.com/static/media/Chatty.909e3b2e.svg",
  toolbarColor: "#62BB46",
  textInputPlaceholder: "Select an option above",
  positiveFeedbackIntent: "",
  negativeFeedbackIntent: "",
  helpIntent: "",
  minButtonContent: "",
  backButton: false,
  restartButton: true,
  enableInput: false,
  messageMenu: false,
  hideButtonMessageBubble: false,
  enableLogin: false,
  enableLiveChat: false,
  forceLogin: false,
  AllowSuperDangerousHTMLInMessage: true,
  shouldDisplayResponseCardTitle: false,
  shouldDisableClickedResponseCardButtons: true,
  shouldRenderSfxButton: false,
  showErrorIcon: true,
  stripTagsFromBotMessages: true,
  convertUrlToLinksInBotMessages: true,
  showErrorDetails: true,
  saveHistory: false,
  helpContent: {},
  enableSFX: false,
  hideInputFieldsForButtonResponse: false,
  pushInitialTextOnRestart: false,
  directFocusToBotInput: false,
  showDialogStateIcon: false,
  avatarImageUrl:
    "https://welcomecenter.devicebits.com/static/media/Chatty.909e3b2e.svg",
  favIcon:
    "https://welcome-center-assets.s3.amazonaws.com/ChattyBot-transparent.png",
};

export const polly = {
  voiceId: "Salli",
};

export const recorder = {
  enable: false,
};

export const iframe = {
  iframeOrigin: "",
  shouldLoadIframeMinimized: true,
  iframeSrcPath: "/index.html#/?lexWebUiEmbed=true",
};

export const staticLexConfig = {
  initialText: "",
  initialSpeechInstruction: "Say 'help' to get started.",
  initialUtterance: "startModule",
  reInitSessionAttributesOnRestart: false,
  retryOnLexPostTextTimeout: "false",
  retryCountPostTextTimeout: "1",
}