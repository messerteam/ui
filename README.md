[Whisper Model]: https://github.com/openai/whisper
[Messer Frontend]: https://github.com/messerteam/ui
[Messer Whisper]: https://github.com/messerteam/whisper
[Messer Backend]: https://github.com/messerteam/backend

# Messer Frontend

This is one of the three parts of the Messer project. This part is the Frontend, which provides a user interface for the user to interact with the videos.

Other parts of the project are:
- [x] [Messer Frontend]: The frontend is a web application that provides a user interface for the user to interact with the videos.
- [ ] [Messer Whisper]: Whisper is a RESTful API that provides the [Whisper Model] for the backend.
- [ ] [Messer Backend]: The backend is a RESTful API that provides the data for the frontend.

## Getting Started
This code is written in TypeScript & React. To get started, you need to install the dependencies. You can do this by running the following command:

```bash
pnpm i
pnpm build
pnpm start
```
This will install the dependencies and start the server on port 3000.

## Environment Variables
The following environment variables are required to run the server:

| Name | Description | Default |
|------|-------------|---------|
| `API_URL` | The URL of the Backend API | `http://localhost:3001` |

## Other Ways to Run
### Docker
You can also run the server using Docker. To do this, you need to build the Docker image and run it. You can do this by running the following commands:

```bash
docker build -t messerteam/ui .
docker run -p 3000:3000 messerteam/ui
```
