using SmartDocAI.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDocAI.Infrastructure.Services
{
    public class TextFileTextExtractor : IDocumentTextExtractor
    {
        public async Task<string> ExtractTextAsync(string filePath)
        {
            var text = string.Empty;

            try
            {
                using (var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
                {
                    var streamReader = new StreamReader(stream);
                    text = streamReader.ReadToEnd();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error extracting text from file: {ex.Message}");
            }

            return await Task.FromResult(text);
        }
    }
}
