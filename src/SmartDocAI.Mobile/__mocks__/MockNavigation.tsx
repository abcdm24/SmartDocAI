export const createMockNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  replace: jest.fn(),
  // ...
  push: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
  setParams: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  reset: jest.fn(),
  dispatch: jest.fn(),
  isFocused: jest.fn(() => true),
  canGoBack: jest.fn(() => true),
});

export const mockRouteUpload = () => ({
  key: "Upload",
  name: "upload",
  params: {},
});

export const mockRouteSummarize = () => ({
  key: "Summarize",
  name: "Summarize",
  params: {},
});

export const mockRouteAskAI = () => ({
  key: "AskAI",
  name: "AskAI",
  params: {},
});
