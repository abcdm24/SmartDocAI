using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDocAI.Infrastructure.Configuration
{
    public class AzureOpenAIOptions
    {
        public string EndPoint { get; set; } = string.Empty;
        public string ApiKey { get; set; } = string.Empty;
        public string Deployment { get; set; } = string.Empty;
    }
}
