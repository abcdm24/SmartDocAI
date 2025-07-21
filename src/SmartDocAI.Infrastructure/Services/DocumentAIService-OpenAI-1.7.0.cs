//using SmartDocAI.Application.Interfaces;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
////using OpenAI;
////using OpenAI.Chat;
////using OpenAI_API;
////using OpenAI_API.Chat;
//using Microsoft.Extensions.Options;
//using SmartDocAI.Infrastructure.Configuration;

//namespace SmartDocAI.Infrastructure.Services
//{
//    public class DocumentAIService-OpenAI-1.7.0 : IDocumentAIService
//    {
//        // private readonly OpenAIClient _openAI;
//        private readonly OpenAIAPI _openAI;

//        public DocumentAIService-OpenAI-1.7.0(IOptions<OpenAIOptions> options)
//        {
//            _openAI = new OpenAIAPI(options.Value.ApiKey);
//        }

//        public async Task<string> GenerateSummaryAsync(string extractedText)
//        {
//            var chatRequest = new ChatRequest
//            {
//                Model = "gpt-3.5-turbo", // or gpt-4
//                Messages = new List<ChatMessage>
//                {
//                    new ChatMessage(ChatMessageRole.System, "You are a helpful assistant."),
//                    new ChatMessage(ChatMessageRole.User, $"Summarize the following:\n{extractedText}")
//                }
//            };

//            var result = await _openAI.Chat.CreateChatCompletionAsync(chatRequest);

//            return result.Choices[0].Message.Content;

//            //var result = await _openAI.Chat.CreateChatCompletionAsync((new()
//            //{
//            //    Messages = new List<ChatMessage>
//            //{
//            //    ChatMessage.FromSystem("You are a helpful assistant."),
//            //    ChatMessage.FromUser($"Summarize this document:\n{extractedText}")
//            //}
//            //});


//            //var messages = new List<Message>
//            //{
//            //    Message.FromSystem("You are a helpful assistant."),
//            //    ChatMessage.FromUser($"Summarize the following text:\n{extractedText}")
//            //};

//            //var request = new ChatRequest(
//            //    model: "gpt-3.5-turbo",
//            //    messages: messages,
//            //    temperature: 0.7,
//            //    maxTokens: 150
//            //);

//            //var result = await _openAI.ChatEndpoint.GetChatCompletionsAsync(request);
//            //Console.WriteLine(result.FirstChoice.Message.Content);

//            //return await Task.FromResult("This is a placeholder summary. Replace with actual OpenAI API call.");
//            //        {
//            //            Model = "gpt-3.5-turbo",
//            //            Messages = new List<ChatMessage>
//            //{
//            //    ChatMessage.FromSystem("You are a helpful assistant."),
//            //    ChatMessage.FromUser($"Summarize the following text:\n{extractedText}")
//            //},
//            //            MaxTokens = 150
//            //        };


//            // Fix: Use the ChatEndpoint to create a completion since OpenAIClient does not have a 'Completions' property.
//            //var result = await _openAI.ChatEndpoint.GetCompletionAsync(
//            //    new OpenAI.Chat.ChatRequest
//            //    {
//            //        Model = "gpt-3.5-turbo",
//            //        Messages = new List<OpenAI.Chat.ChatMessage>
//            //        {
//            //                new OpenAI.Chat.ChatMessage
//            //                {
//            //                    Role = "system",
//            //                    Content = "You are a helpful assistant."
//            //                },
//            //                new OpenAI.Chat.ChatMessage
//            //                {
//            //                    Role = "user",
//            //                    Content = $"Summarize the following text:\n{extractedText}"
//            //                }
//            //        },
//            //        MaxTokens = 150
//            //    });

//            //return result.Choices.FirstOrDefault()?.Message.Content ?? string.Empty;
//        }

//        public async Task<string> RespondToPromptAsync(string extractedText, string userPrompt)
//        {
//            var result = await _openAI.Chat.CreateChatCompletionAsync(new ChatRequest()
//            {
//                Messages = new List<ChatMessage>
//                {
//                    new ChatMessage(ChatMessageRole.System,"You are an intelligent document assistant."),
//                    new ChatMessage(ChatMessageRole.User,$"Document: {extractedText}\n\nUser Prompt: {userPrompt}")
//                }
//            });

//            return result.Choices[0].Message.Content;

//        }
//    }
//}
