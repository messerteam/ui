# Messer UI

This is the UI for Messer, a tool for creating and managing videos with subtitles in minutes.

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)

## Getting Started

To get started, you will need to have the following installed:

- [Node.js](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/)
- [Git](https://git-scm.com/)

## Installation

```bash
# Install dependencies
pnpm i
```

## Development

```bash
pnpm dev
```

## Production

```bash
pnpm build
pnpm start
```

## Environment Variables

If you want to run a production build, you will need to set the following environment variables:

| Name      | Description                | Default Value           |
| --------- | -------------------------- | ----------------------- |
| `API_URL` | The URL of the Backend API | `http://localhost:5001` |

## Docker Support

```bash
# Build the image
docker build -t messerteam/ui .

# Run the image
docker run -p 3000:3000 messerteam/ui

# Run the image with environment variables
docker run -p 3000:3000 -e API_URL=<API-URL> messerteam/ui

# Use official image
docker run -p 3000:3000 -e API_URL=<API-URL> docker.io/messerteam/ui:1.0
```
