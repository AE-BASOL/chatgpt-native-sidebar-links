# ChatGPT Native Sidebar Links

Restores native browser link behavior for conversations in the ChatGPT sidebar.

It makes conversation titles behave like real links again, so browser features such as these work normally:

- Open in new tab
- Open in new window
- Open in split view where supported
- Cmd or Ctrl click
- Middle click

ChatGPT controls such as rename, pin, share, archive, and delete remain available.

## Install locally

### Chrome, Arc, Brave, Edge

1. Download or clone this repository.
2. Copy `manifest.chrome.json` to `manifest.json`.
3. Open your browser's extensions page.
4. Enable Developer mode.
5. Choose Load unpacked.
6. Select this repository folder.

### Firefox

1. Download or clone this repository.
2. Copy `manifest.firefox.json` to `manifest.json`.
3. Open `about:debugging#/runtime/this-firefox`.
4. Choose Load Temporary Add-on.
5. Select `manifest.json`.

## Privacy

No telemetry. No backend. No data collection.

The extension runs locally and only modifies ChatGPT sidebar link behavior.

See [PRIVACY.md](PRIVACY.md).

## Status

Early working version. ChatGPT UI changes may require selector updates.

## License

MIT.
