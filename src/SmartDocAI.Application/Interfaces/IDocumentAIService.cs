using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDocAI.Application.Interfaces
{
    public interface IDocumentAIService
    {
        Task<string> GenerateSummaryAsync(string extractedText);
        Task<string> RespondToPromptAsync(string extractedText, string userPrompt);
    }
}
