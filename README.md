# Ollama Kiss UI

A simple, stupid UI for Ollama. Keep It Simple, Stupid (KISS).

## Why Another UI?

While there are many excellent Ollama UIs available, most of them come with abundant features and dependencies that you might not need. I just wanted a straightforward interface to chat with Ollama models, without installing a ton of packages or dealing with complex configurations.

So I spent 5 hours building this minimalist UI.

## Features

- Single page chat interface
- Model switching
- Chat history
- Markdown support (including code blocks)
- Dark/Light theme
- Server URL configuration
- That's it!

## Installation

1. Install from Chrome Web Store (coming soon)
2. Or load unpacked:
   - Clone this repository
   - `npm install`
   - `npm run build`
   - Open Chrome Extensions page
   - Enable Developer mode
   - Click "Load unpacked" and select the `dist` folder

## Prerequisites

- [Ollama](https://ollama.ai/) installed and running
- A web browser

## Usage

1. Open the extension
2. Make sure your Ollama server is running (default: http://localhost:11434)
3. Select a model
4. Start chatting!

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
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
