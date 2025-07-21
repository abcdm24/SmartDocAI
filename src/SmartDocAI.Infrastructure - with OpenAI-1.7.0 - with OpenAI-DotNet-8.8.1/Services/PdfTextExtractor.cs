using SmartDocAI.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UglyToad.PdfPig;

namespace SmartDocAI.Infrastructure.Services
{
    public class PdfTextExtractor : IDocumentTextExtractor
    {
        public async Task<string> ExtractTextAsync(string filePath)
        {
            var text = new StringBuilder();
            try
            {
                using var document = PdfDocument.Open(filePath);
                foreach (var page in document.GetPages())
                {
                    text.AppendLine(page.Text);
                }
            }
            catch (Exception ex)
            { 
                Console.WriteLine($"Error extracting text from PDF: {ex.Message}");
            }
            return await Task.FromResult(text.ToString());
        }
    }
}
