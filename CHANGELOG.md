# Changelog

## v1.4.0 - 2026-05-30

### Breaking Changes

- Require Node.js `>=18.18.0`.
- Remove the hardcoded default Deezer ARL. Consumers must initialize Deezer auth with their own ARL when authenticated endpoints are needed.
- Remove the Musixmatch lyrics fallback. Lyrics are now fetched only from Deezer.

### Added

- Add direct Spotify API support using anonymous embed tokens, replacing the archived `spotify-web-api-node` package.
- Add Spotify playlist fallback through Spotify's web partner API when the public Spotify API is unavailable or rate-limited.
- Add metadata-based Spotify-to-Deezer matching when Spotify tracks do not resolve through ISRC.
- Add support for Deezer shared links from `link.deezer.com`.
- Add a local `ConcurrencyQueue` helper to replace `p-queue`.
- Add a local `delay` helper to replace the external `delay` package.

### Fixed

- Refresh Deezer API tokens when Deezer returns invalid CSRF/token errors.
- Encode object values in Deezer GET gateway query params, fixing playlist channel requests.
- Improve YouTube metadata parsing and matching after YouTube page structure changes.
- Refresh Deezer, Spotify, Tidal, and YouTube test fixtures for current upstream responses.
- Update Tidal and Spotify playlist fixtures to currently valid shared playlists.

### Removed

- Remove `spotify-web-api-node`.
- Remove `p-queue`.
- Remove `delay`.
- Remove `node-html-parser`.
- Remove unused Musixmatch lyrics and user-agent helper files.
- Replace `yarn.lock` with `bun.lock`.

### Tooling and Tests

- Migrate tests from AVA/ts-node to Bun test.
- Migrate ESLint config to ESLint 9 flat config.
- Update TypeScript to `6.0.3`.
- Update Prettier to `3.8.3`.
- Update `browser-id3-writer` to `5.0.0`.
- Add focused tests for the local concurrency queue.
- Skip direct Spotify API tests in CI where no fallback exists, while keeping fallback-backed playlist coverage active.
