# RepoDocster

**RepoDocster** is a web-based app that fetches and processes markdown documentation (such as README.md and CHANGELOG.md) from GitHub repositories. It leverages the `mddoc-toolkit` library to extract and present important sections of markdown files, making it easier for developers to interact with and review repository documentation.

## Main Features

- **GitHub Repository Integration**: Input a GitHub repository URL and fetch its markdown documentation (e.g., `README.md`, `CHANGELOG.md`).
- **Markdown Parsing**: Uses the `mddoc-toolkit` library to parse and extract sections from markdown files.
- **Switch Between README and Changelog**: Users can toggle between fetching and processing either a repository’s `README.md` or `CHANGELOG.md`.
- **Section Selection**: Users can select specific parts of the markdown to retrieve, including:
  - Installation Instructions
  - Usage Examples
  - API Documentation
  - Dependencies
  - License Information
  - Changelog Features (e.g., Added Features, Unreleased Changes)
- **Report Generation**: Generate and download reports based on the extracted sections in JSON or text format.
- **Responsive User Interface**: Built with React, providing an intuitive and user-friendly experience for interacting with repository documents.
  
## Planned Features

- **File Upload Support**: Allow users to upload markdown files from their local filesystem instead of fetching from a GitHub repository.
- **Custom Dictionary for Section Extraction**: Enable users to define custom keywords for extracting specific sections from non-standard markdown files.
- **Version Comparison for Changelogs**: Compare different versions of changelogs to see the differences between two specified versions.
- **Past Report History**: Store and manage previously generated reports locally or in the cloud, allowing users to revisit past markdown processing results.
- **Collaborative Features**: Allow teams to share generated reports and collaborate on reviewing documentation.

## Backend API

The backend API provides endpoints for interacting with GitHub repositories and fetching markdown files.

### Endpoints

#### `GET /api/github-docs/:owner/:repo/:filepath`

Fetches a specific markdown file from a GitHub repository.

- **Parameters**:
  - `owner` (string): GitHub owner (e.g., username or organization).
  - `repo` (string): Repository name.
  - `filepath` (string): The file path inside the repository (e.g., `README.md` or `CHANGELOG.md`).
  
- **Response**: Returns the raw markdown content of the file.

Example:

```bash
GET /api/github-docs/kikinit/RepoDocster/README.md
```

Response:

```json
{
  "content": "# RepoDocster\n\nRepoDocster is a web-based app..."
}
```

## Installation

To run the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kikinit/RepoDocster.git
   ```

2. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

4. **Run the app**:
   - In one terminal, start the backend:
     ```bash
     cd backend
     ./start.sh
     ```
   - In another terminal, start the frontend:
     ```bash
     cd frontend
     npm start
     ```

## Usage

1. Visit the app in your browser after starting the frontend and backend (typically at `http://localhost:3000`).
2. Enter a GitHub repository URL into the input form.
3. Select the markdown file you want to fetch (README or Changelog).
4. Check the sections you want to extract (e.g., Installation Instructions, API Documentation).
5. Click "Submit" to retrieve and display the selected sections.
6. Optionally, generate a downloadable report from the retrieved sections.

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue to discuss improvements, additional features, or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
