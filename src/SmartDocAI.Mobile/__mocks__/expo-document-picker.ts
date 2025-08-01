export const getDocumentAsync = jest.fn().mockResolvedValue({
  assets: [
    {
      name: "sample.pdf",
      uri: "file://mock/sample.pdf",
      mimeType: "application/pdf",
    },
  ],
  type: "success",
});
