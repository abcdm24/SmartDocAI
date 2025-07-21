using Microsoft.AspNetCore.Mvc;
using SmartDocAI.Application.DTOs;
using SmartDocAI.Application.Interfaces;
using SmartDocAI.Domain.Entities;
using System.Reflection;
using System.Text;

namespace SmartDocAI.Web.Controllers
{
    /// <summary>
    /// Controller for managing document-related operations.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentsController : ControllerBase
    {
        private readonly IDocumentService _documentService;
        private readonly IDocumentProcessingService _documentProcessingService;
        //private readonly IWebHostEnvironment _env;
        private readonly IDocumentAIService _documentAIService;
        private readonly ILogger<DocumentsController> _logger;


        /// <summary>
        /// Initializes a new instance of the <see cref="DocumentsController"/> class.
        /// </summary>
        /// <param name="documentService">The document service to handle document operations.</param>
        /// <param name="documentProcessingService">The document service to handle document processing</param>
        /// <param name="documentAIService">The document service to respond AI related service</param>
        /// <param name="logger">Log application runtime info</param>
        public DocumentsController(IDocumentService documentService,
            IDocumentProcessingService documentProcessingService,
            IDocumentAIService documentAIService,
            ILogger<DocumentsController> logger)
        {
            _documentService = documentService;
            _documentProcessingService = documentProcessingService;
            _documentAIService = documentAIService;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves a document by its unique identifier.
        /// </summary>
        /// <param name="id">The unique identifier of the document.</param>
        /// <returns>The document details.</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var doc = await _documentService.GetDocumentByIdAsync(id);
            return Ok(doc);
        }

        /// <summary>
        /// Uploads a new document.
        /// </summary>
        /// <param name="file">The file to be uploaded.</param>
        /// <returns>The unique identifier of the uploaded document.</returns>
        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Upload(IFormFile file) //[FromForm] giving error in swagger
        {
            if (file == null || file.Length == 0)
            {
                _logger.LogWarning("No file provided to upload");
                return BadRequest("No file uploaded.");
            }
            string folderPath = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location)!, "Files");
            //using var stream = new MemoryStream();
            //await file.CopyToAsync(stream);
            //var fileBytes = stream.ToArray();
            //var content = Encoding.UTF8.GetString(fileBytes);
            string userName = User.Identity?.Name ?? "Anonymous";
            _logger.LogInformation($"Uploading document {file.FileName}");
            var document = await _documentService.UploadDocumentAsync(file, userName);
            _logger.LogInformation($"Uploaded document: {document.FileName} in folder: {document.StoragePath}");
            return Ok(new DocumentDto { Id = document.Id, Name = document.FileName, UploadedAt = document.UploadedAt });
        }


        /// <summary>
        /// Get content for the given document id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>document content</returns>
        [HttpGet("{id}/extract-text")]
        public async Task<IActionResult> ExtractText(Guid id)
        {
            var text = await _documentProcessingService.ExtractTextAsync(id);
            if (string.IsNullOrEmpty(text))
            {
                _logger.LogWarning($"No document text found for document id: {id}");
                return NotFound("No text extracted from the document.");
            }
            _logger.LogInformation($"Text extracted for id:{id}");
            return Ok(new { Text = text });
        }

        /// <summary>
        /// Generates a summary for the document with the given id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}/summarize")]
        public async Task<IActionResult> Summarize(Guid id)
        {
            var extractedText = await _documentProcessingService.ExtractTextAsync(id);
            if (string.IsNullOrEmpty(extractedText))
            {
                _logger.LogWarning($"No text extracted for the id: {id}");
                return NotFound("No text extracted from the document.");
            }
            _logger.LogInformation($"Getting summary for document id: {id}");
            var summary = await _documentAIService.GenerateSummaryAsync(extractedText);
            _logger.LogInformation("Summary generated");
            return Ok(new { Summary = summary });
        }

        /// <summary>
        /// Responds to a user prompt based on the document's extracted text.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userPrompt"></param>
        /// <returns></returns>
        [HttpPost("{id}/ask")]
        public async Task<IActionResult> Ask(Guid id, [FromBody]string userPrompt)
        {
            if (string.IsNullOrEmpty(userPrompt))
            {
                _logger.LogWarning($"User prompt cannot be empty for document id:{id}");
                return BadRequest("User prompt cannot be empty.");
            }
            var extractedText = await _documentProcessingService.ExtractTextAsync(id);
            if (string.IsNullOrEmpty(extractedText))
            {
                _logger.LogWarning($"No text extracted for document id: {id}");
                return NotFound("No text extracted from the document.");
            }
            _logger.LogInformation("Getting AI reponse for user prompt");
            var response = await _documentAIService.RespondToPromptAsync(extractedText, userPrompt);
            _logger.LogInformation("AI reponse received for user prompt");
            return Ok(new { Response = response });
        }
    }
}
