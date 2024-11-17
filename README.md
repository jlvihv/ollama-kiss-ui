# Ollama Kiss UI

A simple, stupid UI for Ollama. Keep It Simple, Stupid (KISS).

## Access Methods

### 1. Chrome Extension (Recommended)
- Chrome Web Store version is under review
- Once approved, you can install it directly from the Chrome Web Store
- **Advantage**: No CORS issues to worry about

### 2. GitHub Pages
- Access directly via browser: https://jlvihv.github.io/ollama-kiss-ui/
- **Note**: You'll need to handle CORS when accessing Ollama API

## Why Another UI?

While there are many excellent Ollama UIs available, most of them come with abundant features and dependencies that you might not need. I just wanted a straightforward interface to chat with Ollama models, without installing a ton of packages or dealing with complex configurations.

## Features

- Single page chat interface
- Model switching
- Chat history
- Markdown support (including code blocks)
- Dark/Light theme
- Server URL configuration
- That's it!

## Handling CORS Issues

When accessing through GitHub Pages, you'll need to handle CORS. Here are several ways to configure Ollama to accept CORS requests:

1. **Quick Start (Development)**
   ```bash
   OLLAMA_ORIGINS="*" ollama serve
   ```

2. **Using systemd (Recommended for Linux users)**
   ```bash
   # Edit the service file
   sudo systemctl edit ollama

   # Add these lines:
   [Service]
   Environment="OLLAMA_ORIGINS=*"

   # Restart the service
   sudo systemctl restart ollama
   ```

3. **Permanent Environment Variable**
   - Add to your shell config file (~/.bashrc or ~/.zshrc):
     ```bash
     export OLLAMA_ORIGINS="*"
     ```
   - Then reload your shell or run:
     ```bash
     source ~/.bashrc  # or source ~/.zshrc
     ```

4. **Docker Users**
   ```bash
   docker run -d -e OLLAMA_ORIGINS="*" -p 11434:11434 ollama/ollama
   ```

**Note**: Using `*` allows requests from any origin. For production environments, you may want to restrict this to specific domains for security.

## Installation

1. Install from Chrome Web Store (under review)
2. Or load unpacked:
   - Clone this repository
   - `bun install`
   - `bun run build`
   - Open Chrome Extensions page
   - Enable Developer mode
   - Click "Load unpacked" and select the `dist` folder

## Prerequisites

- [Ollama](https://ollama.ai/) installed and running
- A web browser

## Usage

1. Open the extension or visit the GitHub Pages site
2. Make sure your Ollama server is running (default: http://localhost:11434)
3. Select a model
4. Start chatting!

## Development

```bash
bun install
bun run dev
```

## Build

```bash
bun run build
```

## Philosophy

- No unnecessary features
- No complex configurations
- No massive dependencies
- Just chat

## License

MIT

## Acknowledgments

Built with:

- Svelte
- Tailwind CSS
- DaisyUI
- Marked
- DOMPurify

## Contributing

Feel free to contribute, but remember: keep it simple! If your feature request involves complex configurations or dependencies, it might not align with the project's KISS philosophy.

## Support

If you encounter issues with the UI, feel free to open an issue. If you have problems with Ollama itself, please refer to the [Ollama repository](https://github.com/ollama/ollama).

---

Remember: Sometimes, less is more. 🎈
