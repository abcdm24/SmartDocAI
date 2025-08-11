using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SmartDocAI.Application.Interfaces;
using SmartDocAI.Infrastructure.Persistence;
using SmartDocAI.Infrastructure.Persistence.Repositories;
using SmartDocAI.Infrastructure.Services;


namespace SmartDocAI.Infrastructure.Configuration
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddDbContext<SmartDocAIDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));


            services.AddScoped<IDocumentRepository, DocumentRepository>();
            //services.AddScoped<IDocumentRepository, MockDocumentRepository>();
            services.AddScoped<IDocumentService, DocumentService>();
            services.AddScoped<IDocumentProcessingService, DocumentProcessingService>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IAuthService, AuthService>();

            services.AddSingleton<IJwtService, JwtService>();

            services.AddTransient<PdfTextExtractor>();
            services.AddTransient<WordTextExtractor>();
            services.AddTransient<TextFileTextExtractor>();

            //Factory for choosing extractor based on file type
            services.AddTransient<Func<string, IDocumentTextExtractor>>(provider =>
                filePath =>
                {
                    var ext = Path.GetExtension(filePath).ToLowerInvariant();
                    return ext switch
                    {
                        ".pdf" => provider.GetRequiredService<PdfTextExtractor>(),
                        ".docx" => provider.GetRequiredService<WordTextExtractor>(),
                        ".txt" => provider.GetRequiredService<TextFileTextExtractor>(),
                        _ => throw new NotSupportedException($"File type '{ext}' is not supported.")
                    };
                }
            );

            //services.Configure<OpenAIOptions>(configuration.GetSection("OpenAI"));

            ////services.AddOptions<OpenAIOptions>()
            ////    .Bind(configuration.GetSection("OpenAI"));

            services.Configure<AzureOpenAIOptions>(configuration.GetSection("AzureOpenAI"));

            services.AddSingleton<IDocumentAIService, DocumentAIService>();


            return services;
        }
    }
}
