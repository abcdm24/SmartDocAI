using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDocAI.Application.Interfaces
{
    public interface IDocumentProcessingService
    {
        Task<string> ExtractTextAsync(Guid documentId);
    }
}
