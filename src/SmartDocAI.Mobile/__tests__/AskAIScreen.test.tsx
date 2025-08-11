import React, { act } from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import api from "../api/axios";
import AskAIScreen from "../screens/AskAIScreen";
import { DocumentContext } from "../context/DocumentContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import {
  createMockNavigation,
  mockRouteAskAI,
} from "../__mocks__/MockNavigation";
import { isAxiosError } from "axios";

jest.mock("../api/axios");
jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));

const mockNavigation = createMockNavigation();

const renderWithContext = (
  docId: string | null = "mock-doc-id",
  filename = "sample.pdf"
) => {
  return render(
    <DocumentContext.Provider
      value={{
        docId,
        fileName: filename,
        setDocId: jest.fn(),
        setFileName: jest.fn(),
      }}
    >
      <AskAIScreen
        navigation={mockNavigation as any}
        route={mockRouteAskAI as any}
      ></AskAIScreen>
    </DocumentContext.Provider>
  );
};

describe("AskAIScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders the AskAI button", () => {
    const { getByText, getByTestId } = renderWithContext();
    expect(getByTestId("question-input")).toBeTruthy();
    expect(getByTestId("askai-button")).toBeTruthy();
  });

  it("enter question, call askai api and display response", async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: { response: "This is an AI response" },
    });

    const { getByText, getByTestId } = renderWithContext();

    const input = getByTestId("question-input");

    await act(async () => {
      fireEvent.changeText(input, "Query for AI");
    });

    await act(async () => {
      fireEvent.press(getByTestId("askai-button"));
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "documents/mock-doc-id/ask",
        expect.any(String),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      expect(getByText("This is an AI response")).toBeTruthy();
      console.log("Called Ask AI API and received response");
    });
  });

  it("Shows error if question is missing", async () => {
    const { getByText, getByTestId } = renderWithContext();

    const askaibutton = getByTestId("askai-button");

    await act(async () => {
      fireEvent.press(askaibutton);
    });
    await waitFor(() => {
      expect(getByTestId("error-text")).toBeTruthy();
      console.log(`Error text: ${getByTestId("error-text").props.children}`);
    });
  });

  it("Shows fallback error message if unknown error occurs", async () => {
    (api.post as jest.Mock).mockRejectedValueOnce("Error occured");

    const { getByText, getByTestId } = renderWithContext();

    const inputElement = getByTestId("question-input");

    await act(async () => {
      fireEvent.changeText(inputElement, "This is a query to AI");
    });

    const askaibutton = getByTestId("askai-button");

    await act(async () => {
      fireEvent.press(askaibutton);
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
      expect(getByTestId("error-text")).toBeTruthy();
      expect(getByTestId("error-text").props.children).toBe(
        "Something went wrong"
      );
      console.log(`Error text: $(getByTestId("error-text").props.children)`);
    });
  });

  it("shows API error message from Axios error", async () => {
    (api.post as jest.Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        data: { message: "Invalid request to AI" },
      },
    });

    const { getByTestId } = renderWithContext();

    const input = getByTestId("question-input");

    await act(async () => {
      fireEvent.changeText(input, "AI query");
    });

    await act(async () => {
      fireEvent.press(getByTestId("askai-button"));
    });

    await waitFor(() => {
      expect(getByTestId("error-text").props.children).toBe(
        "Something went wrong"
      );
    });
  });

  it("shows and hides loading indicator during API call", async () => {
    let resolveApiCall: Function;
    (api.post as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveApiCall = resolve;
        })
    );

    const { getByTestId, queryByTestId } = renderWithContext();

    fireEvent.changeText(getByTestId("question-input"), "AI, answer this");
    fireEvent.press(getByTestId("askai-button"));

    expect(getByTestId("loading-indicator")).toBeTruthy();

    await act(async () => {
      resolveApiCall({
        status: 200,
        data: { response: "Answer received" },
      });
    });

    await waitFor(() => {
      expect(queryByTestId("loading-indicator")).toBeNull();
    });
  });

  it("disable Ask AI if docId is null", async () => {
    const { getByTestId, queryByTestId } = renderWithContext(null);

    fireEvent.changeText(getByTestId("question-input"), "Test question");
    fireEvent.press(getByTestId("askai-button"));

    await waitFor(() => {
      expect(api.post).not.toHaveBeenCalled();
      expect(getByTestId("error-text").props.children).toBe(
        "No document selected"
      );
    });
  });

  it("prevents multiple submission while loading", async () => {
    const mockPromise = new Promise(() => {});

    (api.post as jest.Mock).mockReturnValue(mockPromise);

    const { getByTestId } = renderWithContext();

    fireEvent.changeText(getByTestId("question-input"), "AI question");

    await act(async () => {
      fireEvent.press(getByTestId("question-input"));
      fireEvent.press(getByTestId("askai-button"));
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
    });
  });
});
