import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Upload from "../pages/Upload";
//import { HelmetProvider } from "react-helmet-async";
import api from "../api/axios";
import userEvent from "@testing-library/user-event";
//import axios from "axios";

vi.mock("../api/axios.ts");

// vi.mock("../api/axios.ts", () => {
//   return {
//     default: {
//       post: vi.fn(),
//       get: vi.fn(),
//     },
//   };
// });

describe("Upload Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  async function simulateFileUpload() {
    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });

    vi.mocked(api.post).mockResolvedValueOnce({
      data: { id: "123", name: "test.pdf" },
    });

    vi.mocked(api.get).mockResolvedValueOnce({
      data: { text: "Extracted text from document" },
    });

    const fileInput = screen.getByLabelText(/select a file/i);
    await waitFor(() => {
      //fireEvent.change(fileInput, { target: { files: [file] } });
      userEvent.upload(fileInput, file);
    });

    await (async () => Promise.resolve());
    await waitFor(() => {
      const input = screen.getByLabelText(/select a file/i) as HTMLInputElement;
      console.log("Uploaded file name:", input.files?.[0]?.name); // should log "test.pdf"
      expect(input.files?.length).toBe(1);
      expect(input.files?.[0]?.name).toBe("test.pdf");
    });
    const uploadButton = screen.getByText(/upload & extract/i);
    if (uploadButton) {
      console.log("Upload button found:", uploadButton.textContent);
    }
    await waitFor(() => {
      //fireEvent.click(uploadButton);
      userEvent.click(uploadButton);
    });

    await (async () => Promise.resolve());

    const form = screen.getByTestId("upload-form"); // Add `data-testid="upload-form"` to <form>
    await waitFor(() => {
      fireEvent.submit(form);
    });

    await (async () => Promise.resolve());

    await waitFor(() => {
      console.log("api.post calls:", (api.post as any).mock.calls);
      expect(api.post).toHaveBeenCalledWith(
        "documents/upload",
        expect.any(FormData),
        expect.objectContaining({
          headers: { "Content-Type": "multipart/form-data" },
        })
      );
    });

    await (async () => Promise.resolve());

    await waitFor(() => {
      console.log("api.get calls:", (api.get as any).mock.calls);
      expect(api.get).toHaveBeenCalledWith("documents/123/extract-text");
      //expect(screen.getByText(/Extracted Text/i)).toBeInTheDocument();
      expect(screen.getByTestId("extracted-text-title")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("Extracted text from document")
      ).toBeInTheDocument();
    });

    await (async () => Promise.resolve());
  }

  it("uploads file and displays extracted text", async () => {
    // const file = new File(["dummy content"], "test.pdf", {
    //   type: "application/pdf",
    // });

    // vi.mocked(api.post).mockResolvedValueOnce({
    //   data: { id: "123", name: "test.pdf" },
    // });

    // vi.mocked(api.get).mockResolvedValueOnce({
    //   data: { text: "Extracted text from document" },
    // });

    render(
      // <HelmetProvider>
      <Upload />
      // </HelmetProvider>
    );
    await simulateFileUpload();
    // // // const fileInput = screen.getByLabelText(/Select a file/i);
    // // // fireEvent.change(fileInput, { target: { files: [file] } });

    // // // const uploadButton = screen.getByText(/Upload & Extract/i);
    // // // fireEvent.click(uploadButton);

    // const fileInput = screen.getByLabelText(/select a file/i);
    // await waitFor(() => {
    //   //fireEvent.change(fileInput, { target: { files: [file] } });
    //   userEvent.upload(fileInput, file);
    // });
    // await (async () => Promise.resolve());
    // await waitFor(() => {
    //   const input = screen.getByLabelText(/select a file/i) as HTMLInputElement;
    //   console.log("Uploaded file name:", input.files?.[0]?.name); // should log "test.pdf"
    //   expect(input.files?.length).toBe(1);
    //   expect(input.files?.[0]?.name).toBe("test.pdf");
    // });
    // const uploadButton = screen.getByText(/upload & extract/i);
    // if (uploadButton) {
    //   console.log("Upload button found:", uploadButton.textContent);
    // }
    // await waitFor(() => {
    //   //fireEvent.click(uploadButton);
    //   userEvent.click(uploadButton);
    // });

    // await (async () => Promise.resolve());

    // const form = screen.getByTestId("upload-form"); // Add `data-testid="upload-form"` to <form>
    // await waitFor(() => {
    //   fireEvent.submit(form);
    // });

    // await (async () => Promise.resolve());

    // await waitFor(() => {
    //   console.log("api.post calls:", (api.post as any).mock.calls);
    //   expect(api.post).toHaveBeenCalledWith(
    //     "/upload",
    //     expect.any(FormData),
    //     expect.objectContaining({
    //       headers: { "Content-Type": "multipart/form-data" },
    //     })
    //   );
    // });

    // await (async () => Promise.resolve());

    // await waitFor(() => {
    //   console.log("api.get calls:", (api.get as any).mock.calls);
    //   expect(api.get).toHaveBeenCalledWith("/123/extract-text");
    //   //expect(screen.getByText(/Extracted Text/i)).toBeInTheDocument();
    //   expect(screen.getByTestId("extracted-text-title")).toBeInTheDocument();
    //   expect(
    //     screen.getByDisplayValue("Extracted text from document")
    //   ).toBeInTheDocument();
    // });

    // await (async () => Promise.resolve());
  });

  it("generated summary when summarize button is clicked", async () => {
    render(
      // <HelmetProvider>
      <Upload />
      // </HelmetProvider>
    );

    //Upload data
    await simulateFileUpload();
    //Upload data

    (api.get as any).mockResolvedValueOnce({
      data: { summary: "This is a summary." },
    });

    const summarizeButton = screen.getByText(/generate summary/i);
    if (summarizeButton) {
      console.log("Summarize button found:", summarizeButton.textContent);
    }
    // fireEvent.click(summarizeButton);
    await waitFor(() => {
      userEvent.click(summarizeButton);
    });

    // await waitFor(() => {
    //   expect(api.get).toHaveBeenCalled();
    //   expect(screen.getByText(/Summary/i)).toBeInTheDocument();
    //   expect(
    //     screen.getByDisplayValue("This is a summary.")
    //   ).toBeInTheDocument();
    // });
  });

  it("sends user prompt and displays AI response", async () => {
    render(
      // <HelmetProvider>
      <Upload />
      // </HelmetProvider>
    );

    await simulateFileUpload();
    (api.post as any).mockResolvedValueOnce({
      data: { response: "AI reply here" },
    });

    const promptInput = screen.getByLabelText(
      /ask something about the document/i
    );
    if (promptInput) {
      console.log("Prompt input found");
    }

    await waitFor(() => {
      fireEvent.change(promptInput, {
        target: { value: "What is this document about?" },
      });
    });

    const askButton = screen.getByText(/ask ai/i);
    if (askButton) {
      console.log("Ask button found");
    }
    await waitFor(() => {
      userEvent.click(askButton);
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
      expect(screen.getByText(/AI Response/i)).toBeInTheDocument();
      expect(screen.getByText("AI reply here")).toBeInTheDocument();
    });
  });
});
