using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDocAI.Domain.ValueObjects
{
    public class DocumentMetadata
    {
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Author { get; set; }
        public int? PageCount { get; set; }
        public long? FileSize { get; set; }
        public string? UploadedBy { get; set; }
        public DateOnly? UploadedDate { get; set; }
    }
}
