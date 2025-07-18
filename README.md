# 🧠 SmartDoc AI

An AI-powered document assistant built with ASP.NET Core MVC + React.  
Upload business documents (PDF, DOCX), extract insights, summarize, and ask questions using OpenAI or Gemini.

---

## 🚀 Features

- Upload and parse business documents (PDF, DOCX, TXT)
- Automatically summarize content
- Extract key information (dates, terms, parties, deadlines)
- Chat with documents (via GPT + embeddings)
- Generate professional replies or reports
- Built with Clean Architecture principles
- Docker-ready for easy deployment

---

## 🧱 Tech Stack

| Layer        | Tech                     |
| ------------ | ------------------------ |
| Frontend     | React + Vite + Axios     |
| Backend      | ASP.NET Core MVC         |
| AI           | OpenAI API or Gemini Pro |
| Parsing      | PdfSharp, OpenXml SDK    |
| Architecture | Clean Architecture (C#)  |
| Container    | Docker + Docker Compose  |
| CI/CD        | GitHub Actions           |

---

## ⚙️ Project Structure

SmartDocAI/
├── src/
│ ├── SmartDocAI.Web/ # ASP.NET Core MVC App
│ ├── SmartDocAI.Application/ # Application Layer (UseCases)
│ ├── SmartDocAI.Domain/ # Domain Models & Interfaces
│ ├── SmartDocAI.Infrastructure/ # External Integrations (OpenAI, DB)
│ ├── SmartDocAI.ReactApp/ # Frontend (React + Vite)
│ └── SmartDocAI.Tests/ # Unit and Integration Tests
├── .github/workflows/ # GitHub Actions CI/CD
├── .gitignore
├── docker-compose.yml
└── README.md

---

## 🐳 Run with Docker

```bash
docker-compose up --build
```

---

🤖 AI Prompt Examples
Here are a few prompts to try in the chat interface:

“Summarize this contract in 3 bullet points.”

“What is the next action required by the client?”

“Extract all payment terms from this agreement.”

“Who are the involved parties in this document?”

---

📌 TODO / Roadmap
Role-based login (Admin/User)

Save chat history and summaries

Add translation API (multilingual support)

Deploy preview version via Azure or Render

MIT © 2025 SmartDoc AI
