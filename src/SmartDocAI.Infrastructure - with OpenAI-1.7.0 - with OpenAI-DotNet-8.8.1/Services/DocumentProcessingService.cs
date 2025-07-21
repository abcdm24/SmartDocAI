using SmartDocAI.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Document = SmartDocAI.Domain.Entities.Document;


namespace SmartDocAI.Infrastructure.Services
{
    public class DocumentProcessingService : IDocumentProcessingService
    {
        private readonly IDocumentRepository _documentRepository;

        public DocumentProcessingService(IDocumentRepository documentRepository)
        {
            _documentRepository = documentRepository;
        }

        public async Task<string> ExtractTextAsync(Guid documentId)
        { 
            var document = await _documentRepository.GetByIdAsync(documentId);
            if(document == null || string.IsNullOrEmpty(document.StoragePath))
            {
                throw new FileNotFoundException("Document not found", nameof(documentId));
            }

            IDocumentTextExtractor? extractor = null;
            var text = string.Empty;
            try
            {
                SetExtractor(document, ref extractor);
                if (extractor != null)
                {
                    text = await extractor.ExtractTextAsync(document.StoragePath);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error extracting text from document: {ex.Message}");
            }

            return text;
        }

        private void SetExtractor(Document document, ref IDocumentTextExtractor? extractor)
        {
            switch (document.FileType)
            {
                case Domain.Enums.DocumentType.Pdf:
                    extractor = new PdfTextExtractor();
                    break;
                case Domain.Enums.DocumentType.Word:
                    extractor = new WordTextExtractor();
                    break;
            }
        }
    }
}
