import React from "react";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { DocumentProvider } from "../context/DocumentContext";
import UploadScreen from "../screens/UploadScreen";
import * as DocumentPicker from "expo-document-picker";
import api from "../api/axios";
import {
  createMockNavigation,
  mockRouteUpload,
} from "../__mocks__/MockNavigation";

export async function performDocumentUploadAndExtract(mockRouteUpload: any) {
  const mockNavigation = createMockNavigation();

  (api.post as jest.Mock).mockResolvedValue({ data: { id: "123" } });

  (api.get as jest.Mock).mockResolvedValueOnce({
    data: { text: "Extracted text from document" },
  });

  const screen = render(
    <DocumentProvider>
      <UploadScreen
        navigation={mockNavigation as any}
        route={mockRouteUpload as any}
      />
    </DocumentProvider>
  );

  const selectButton = screen.getByTestId("upload-button");

  await act(async () => {
    fireEvent.press(selectButton);
  });

  await (async () => Promise.resolve());

  await waitFor(() => {
    expect(DocumentPicker.getDocumentAsync).toHaveBeenCalled();
    expect(screen.getByTestId("selected-file-name")).toBeTruthy();
    console.log(
      "File name:",
      screen.getByTestId("selected-file-name").props.children
    );

    expect(api.post).toHaveBeenCalledWith(
      expect.stringContaining("documents/upload"),
      expect.any(FormData),
      expect.objectContaining({
        headers: { "Content-Type": "multipart/form-data" },
      })
    );

    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining("documents/123/extract-text")
    );
    expect(screen.getByText("Extracted text from document")).toBeTruthy();
    expect(screen.getByText("Uploaded Successfully.")).toBeTruthy();
    console.log(
      `Upload Successful: ${
        screen.getByText("Uploaded Successfully.").props.children
      }`
    );
  });

  return screen;
}
