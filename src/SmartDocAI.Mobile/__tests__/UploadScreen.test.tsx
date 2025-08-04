import React, { act } from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import UploadScreen from "../screens/UploadScreen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { DocumentProvider } from "../context/DocumentContext";
import * as DocumentPicker from "expo-document-picker";
import {
  createMockNavigation,
  mockRouteUpload,
} from "../__mocks__/MockNavigation";
import api from "../api/axios";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { performDocumentUploadAndExtract } from "../testUtils/documentTestHelpers";

jest.mock("expo", () => ({}));
jest.mock("expo-document-picker");
jest.mock("../api/axios");

describe("UploadScreen", () => {
  it("should render correctly", () => {
    const mockNavigation = createMockNavigation();
    const { getByText } = render(
      <DocumentProvider>
        <UploadScreen
          navigation={mockNavigation as any}
          route={mockRouteUpload as any}
        />
      </DocumentProvider>
    );
    expect(getByText("Upload a document")).toBeTruthy();
  });
  it("should pick a document and upload", async () => {
    // const mockNavigation = createMockNavigation();
    // (api.post as jest.Mock).mockResolvedValue({ data: { id: "123" } });
    // (api.get as jest.Mock).mockResolvedValueOnce({
    //   data: { text: "Extracted text from document" },
    // });
    // const { getByText, getByTestId } = render(
    //   <DocumentProvider>
    //     <UploadScreen
    //       navigation={mockNavigation as any}
    //       route={mockRouteUpload as any}
    //     />
    //   </DocumentProvider>
    // );
    // const selectButton = getByTestId("upload-button");
    // await act(async () => {
    //   fireEvent.press(selectButton);
    // });
    // await (async () => Promise.resolve());
    // await waitFor(() => {
    //   expect(DocumentPicker.getDocumentAsync).toHaveBeenCalled();
    //   expect(getByTestId("selected-file-name")).toBeTruthy();
    //   console.log(
    //     "File name:",
    //     getByTestId("selected-file-name").props.children
    //   );
    //   // });
    //   // await (async () => Promise.resolve());
    //   // await waitFor(() => {
    //   //expect(getByText("Uploading...")).toBeTruthy();
    //   expect(api.post).toHaveBeenCalledWith(
    //     expect.stringContaining("/upload"),
    //     expect.any(FormData),
    //     //expect.any(Object),
    //     expect.objectContaining({
    //       headers: { "Content-Type": "multipart/form-data" },
    //     })
    //   );
    //   expect(api.get).toHaveBeenCalledWith(
    //     expect.stringContaining("/123/extract-text")
    //   );
    //   expect(getByText("Extracted text from document")).toBeTruthy();
    //   expect(getByText("Uploaded Successfully.")).toBeTruthy();
    //   console.log(
    //     `Upload Successful: ${
    //       getByText("Uploaded Successfully.").props.children
    //     }`
    //   );
    // });
    const screen = await performDocumentUploadAndExtract(mockRouteUpload);
  });
});
