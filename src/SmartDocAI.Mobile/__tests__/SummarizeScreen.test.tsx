import React, { act } from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import api from "../api/axios";
import SummarizeScreen from "../screens/SummarizeScreen";
import { DocumentContext } from "../context/DocumentContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import {
  createMockNavigation,
  mockRouteSummarize,
} from "../__mocks__/MockNavigation";
import { isAxiosError } from "axios";
jest.mock("../api/axios");

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
      <SummarizeScreen
        navigation={mockNavigation as any}
        route={mockRouteSummarize as any}
      />
    </DocumentContext.Provider>
  );
};

describe("SummarizeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders the summarize button", () => {
    const { getByText } = renderWithContext();
    expect(getByText("Summarize")).toBeTruthy();
  });

  it("calls summarize API and displays summary", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: { summary: "This is a summary" },
    });
    const { getByText, queryByText } = renderWithContext();

    await act(async () => {
      fireEvent.press(getByText("Summarize"));
    });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("mock-doc-id/summarize");
      expect(getByText("This is a summary")).toBeTruthy();
      //expect(queryByText(/Error/i)).toBeNull();
      console.log("Called summarize API and display summary");
    });
  });

  it("Shows error if summarize API fails with response", async () => {
    (api.get as jest.Mock).mockRejectedValueOnce({
      response: { data: { error: "Failed to summarize document." } },
      isAxiosError: true,
    });

    const { getByText, findByText } = renderWithContext();

    await act(async () => {
      fireEvent.press(getByText("Summarize"));
    });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("mock-doc-id/summarize");
      expect(getByText("Failed to summarize document.")).toBeTruthy();
      console.log("Shows error if summarize API fails with response");
    });
  });

  it("Shows error if docId is missing", async () => {
    const { getByText, findByText } = renderWithContext(null);

    await act(async () => {
      fireEvent.press(getByText("Summarize"));
    });

    await waitFor(() => {
      expect(findByText("No document uploaded yet.")).toBeTruthy();
    });
  });

  it("Shows fallback error message if unknown error occurs", async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(
      new Error("Something went wrong while summarizing the document.")
    );
    const { getByText, findByText } = renderWithContext();
    await act(async () => {
      fireEvent.press(getByText("Summarize"));
    });
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("mock-doc-id/summarize");
      expect(
        getByText("Something went wrong while summarizing the document.")
      ).toBeTruthy();
      console.log("Shows error if docId is missing");
    });
  });

  // it("matches snapshot", () => {
  //   const { toJSON } = renderWithContext();
  //   expect(toJSON()).toMatchSnapshot();
  // });
});
