# Alivio Healthcare Platform - Frontend

Alivio is a modern healthcare platform built with Next.js that connects patients with healthcare professionals, facilitates appointment scheduling, and enables secure real-time communication.

## Tech Stack

- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: Tailwind CSS, DaisyUI
- **State Management**: React Hook Form
- **Real-time Communication**: Pusher.js
- **Maps**: Leaflet/React Leaflet
- **UI Components**: Radix UI
- **Animation**: Framer Motion
- **API Requests**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/alivio-frontend.git
   cd alivio-frontend
   ```

2. Install dependencies
   ```bash
   npm install
   # or with yarn
   yarn
   ```

3. Set up environment variables
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

4. Start the development server
   ```bash
   npm run dev
   # or with yarn
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Docker Deployment

The application can also be deployed using Docker:

```bash
# Build and run with docker-compose
docker-compose up -d
```


