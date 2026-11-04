# Releasing

jsDelivr serves files straight from GitHub tags. Use the **all-lowercase** repo name and the version **without** the `v` (so tag `v2.0.0` is `@2.0.0`). The capitalised name and the `@v2.0.0` form can fail with "Failed to fetch version info" because jsDelivr caches that failure (seen on 4 November 2026):

```
https://cdn.jsdelivr.net/gh/madewithpixels/mwp-instant-website-estimate@<version>/dist/mwp-estimate.min.js
https://cdn.jsdelivr.net/gh/madewithpixels/mwp-instant-website-estimate@<version>/dist/mwp-estimate.min.css
```

`dist/` is **committed on purpose**, because jsDelivr doesn't run a build.

## Steps

1. Make your changes in `src/`.
2. Bump `version` in `package.json` (semver, see below).
3. `npm test`. This rebuilds `dist/` with the new version in the banner and runs the smoke test on both bundles.
4. Add an entry to `CHANGELOG.md`.
5. Commit, then tag and push:
   ```bash
   git add -A
   git commit -m "Release v1.1.0"
   git tag v1.1.0
   git push && git push --tags
   ```
6. Update the two URLs in Webflow Page settings to the new tag, publish to staging, run the [checklist](webflow-setup.md#staging-checklist), then publish live.

## Versioning

- **Patch** (1.0.x): bug fixes and copy tweaks, with no markup or prefs changes.
- **Minor** (1.x.0): new features or new prefs keys that are backwards compatible, where existing pages keep working.
- **Major** (x.0.0): anything that changes the [markup contract](markup-contract.md) or removes or renames a prefs key. The Webflow page has to be updated at the same time.

## Pinning & caching

- **Always pin an exact tag** (`@v1.0.0`) in Webflow. A pinned tag is cached permanently and never changes under you.
- `@latest` or a range like `@1` picks up new tags automatically, but jsDelivr caches these for up to 7 days. Use them only on a test page.
- To force-refresh a floating alias after tagging, request `https://purge.jsdelivr.net/gh/madewithpixels/mwp-instant-website-estimate@latest/dist/mwp-estimate.min.js`.
- Never move or re-push an existing tag. Cut a new patch version instead.

## Checking a release

```js
window.__MWP_ESTIMATE_LOADED__ // → "1.0.0"
```

The version is also in the banner comment at the top of both files.
