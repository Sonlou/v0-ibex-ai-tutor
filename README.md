# IbexAI

AI-powered technical tutor for students and learners who need clearer explanations of complex English technical manuals, diagrams, and equipment instructions.

IbexAI helps users ask questions in natural language and upload images for visual context, then receive simplified explanations tailored for technical education in fields such as IT, automotive, and construction.

## Why this project exists

Many technical manuals are written in dense English and are difficult for students to understand without expert guidance. This project bridges that gap by combining:

- A modern web interface for asking questions
- Image-based context support for diagrams and equipment photos
- AI-powered explanations from an external language model
- A streamlined experience for students to learn technical concepts faster

## Features

- Ask technical questions in plain English
- Upload JPG/PNG images for better context
- Receive streamed AI explanations in real time
- Built for educational and technical-learning workflows
- Responsive Next.js interface for desktop and mobile
- Tailwind-based UI with a clean, student-focused layout

## Tech stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui-inspired component structure
- AI model integration via a managed API service

## Project structure

```text
.
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts        # AI chat endpoint
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root app layout
│   └── page.tsx                # Main UI entry point
├── components/
│   ├── header.tsx              # Top navigation
│   ├── search-box.tsx          # Chat input and image upload UI
│   ├── explanation-box.tsx     # Response display area
│   └── ui/                     # Reusable UI primitives
├── lib/
│   └── utils.ts                # Helper utilities
├── public/                     # Static assets
├── styles/                     # Additional styling
├── .gitignore
├── CONTRIBUTING.md
├── components.json
├── next.config.mjs
├── next-env.d.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
├── README.md
└── pnpm-lock.yaml
```

## Getting started

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn
- An AI service API key configured in your environment

### 1. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root and add your API key:

```bash
AI_API_KEY=your_api_key_here
```

### 3. Run the app locally

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Then open http://localhost:3000 in your browser.

## How it works

The app uses a Next.js route at `/api/chat` to send user prompts to an AI service. If an image is uploaded, it is included with the user message so the model can analyze the visual context and generate a better explanation.

The frontend streams the model output back to the user in real time, creating a conversational learning experience similar to an AI tutor.

## API route

The main backend endpoint is:

- `POST /api/chat`

Request body:

```json
{
  "message": "Explain this motor starter diagram",
  "imageBase64": "data:image/png;base64,..."
}
```

If `imageBase64` is omitted, the model responds based on text only.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Contributing

We welcome improvements, fixes, and feature ideas.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines before submitting a PR.

## License

This project does not currently declare a license in the repository metadata. Please check the repository settings or add a license if you intend to distribute it publicly.

## Notes

This project was generated as a learning-focused AI tutor and is designed to be extended with:

- multilingual support
- subject-specific tutoring modes
- saved learning sessions
- PDF/manual parsing
- more specialized evaluation workflows

If you want to build the project further, the best next steps are to add stronger prompt engineering, safer error handling, and a production-ready authentication or session system.

---

Built for technical education and AI-assisted learning.
