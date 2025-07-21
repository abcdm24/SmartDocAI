using Microsoft.Extensions.Logging;
using SmartDocAI.Application.Interfaces;
using SmartDocAI.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace SmartDocAI.Infrastructure.Services
{
    public class DocumentProcessingService : IDocumentProcessingService
    {
        private readonly IDocumentRepository _documentRepository;
        private readonly Func<string, IDocumentTextExtractor> _extractorFactory;
        private readonly ILogger<DocumentProcessingService> _logger;
        public DocumentProcessingService(IDocumentRepository documentRepository, 
            Func<string, IDocumentTextExtractor> extractorFactory,
            ILogger<DocumentProcessingService> logger)
        {
            _documentRepository = documentRepository;
            _extractorFactory = extractorFactory;
            _logger = logger;
        }

        public async Task<string> ExtractTextAsync(Guid documentId)
        {
            var document = await _documentRepository.GetByIdAsync(documentId);
            if (document == null || string.IsNullOrEmpty(document.StoragePath))
            {
                _logger.LogError("Document not found while extracting text");
                throw new FileNotFoundException("Document not found", nameof(documentId));
            }

            //IDocumentTextExtractor? extractor = null;
            var text = string.Empty;
            try
            {
                //SetExtractor(document, ref extractor);
                var extractor = _extractorFactory(document.StoragePath);
                if (extractor != null)
                {
                    text = await extractor.ExtractTextAsync(document.StoragePath);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error extracting text from document: {ex.Message}");
                Console.WriteLine($"Error extracting text from document: {ex.Message}");
            }

            return text;
        }

        private void SetExtractor(IDocument document, ref IDocumentTextExtractor? extractor)
        {
            switch (document.FileType)
            {
                case Domain.Enums.DocumentType.Pdf:
                    extractor = new PdfTextExtractor();
                    break;
                case Domain.Enums.DocumentType.Word:
                    extractor = new WordTextExtractor();
                    break;
                case Domain.Enums.DocumentType.Text:
                    extractor = new TextFileTextExtractor();
                    break;
            }
        }
    }
}
