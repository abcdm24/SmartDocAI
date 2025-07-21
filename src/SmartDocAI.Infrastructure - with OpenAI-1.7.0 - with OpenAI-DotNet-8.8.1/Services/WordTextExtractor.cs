using DocumentFormat.OpenXml.Packaging;
using SmartDocAI.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDocAI.Infrastructure.Services
{
    public class WordTextExtractor : IDocumentTextExtractor
    {
        public async Task<string> ExtractTextAsync(string filePath)
        {
            using var doc = WordprocessingDocument.Open(filePath, false);
            var text = doc.MainDocumentPart?.Document?.InnerText ?? string.Empty;
            return await Task.FromResult(text);
        }
    }
}
