using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDocAI.Application.Interfaces
{
    public interface IDocumentTextExtractor
    {
        Task<string> ExtractTextAsync(string filePath);
    }
}
