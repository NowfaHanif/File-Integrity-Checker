# SecureGuard – File Integrity Checker

Hackathon theme: **Cybersecurity, Digital Trust and Privacy**

SecureGuard lets anyone prove a file is authentic and unmodified. It calculates the file's hash (SHA-256, SHA-384 or SHA-512) **inside the browser** with the Web Crypto API and compares it with a trusted reference hash. File contents are never uploaded; there is no backend.

## Features
- Landing page, Dashboard (total checked, verified, possible tampering alerts)
- File Checker: drag and drop upload, hash generation, copy hash
- Integrity Verification: compare with a reference hash, clear Verified / Possible Tampering result
- Trusted Hashes: save, reuse, delete
- Verification History with timestamps
- Reports: download TXT or CSV
- Privacy & Security page
- Trust Score meter (0-100) and Hash Fingerprint (colour pattern of the hash)
- Batch scan of many files at once
- Risky file alerts (`.exe`, `.bat`, `.js`, double extensions like `invoice.pdf.exe`)
- Tamper Simulation Demo (change 1 digit, see the hash change)
- Multiple algorithms: SHA-256, SHA-384, SHA-512
- Checksum file reader (`.sha256` and similar)
- Backup and restore of trusted hashes and history (JSON)

## Tech stack
React 18, TypeScript, Vite, HTML, CSS, Web Crypto API, localStorage.

## Setup
Requires Node.js 18 or newer.

```bash
npm install
npm run dev        # open the URL shown (localhost works with Web Crypto)
npm run build      # production build in dist/
npm run typecheck  # optional TypeScript check
```

Web Crypto needs HTTPS or localhost.

## Project structure
```
src/
  App.tsx            navigation and shared state
  types.ts           HistoryEntry, TrustedHash
  lib/utils.ts       hashing, risk and score helpers, storage helpers
  components/        Tag, Finger, Meter, RiskBox, Batch
  pages/             Home, Dashboard, FileChecker, TrustedHashes,
                     HistoryPage, Reports, TamperDemo, Privacy
```

## Privacy design
- Files are read and hashed locally; nothing is sent over the network.
- Only metadata is stored in localStorage: file name, size, hash, result, algorithm, time.
- Users can delete trusted hashes, clear history, or clear site data at any time.

## Test cases
| # | Action | Expected result |
|---|--------|-----------------|
| 1 | Drop any file | 64-character SHA-256 hash appears |
| 2 | Paste the same hash as reference, click Verify | Green Verified |
| 3 | Edit the file by one character, check against old hash | Red Possible Tampering |
| 4 | Paste `abc123` as reference | Error about required hash length |
| 5 | Drop an empty file | Error message |
| 6 | Save a trusted hash, pick it from the dropdown, delete it | Works, list updates |
| 7 | Run several checks | Dashboard counts and History timestamps update |
| 8 | Reports: download TXT and CSV | Both files download |
| 9 | Refresh the page | History and trusted hashes remain |
| 10 | Select SHA-512 | 128-character hash |
| 11 | Load a `.sha256` file (`<hash>  filename`) | Reference filled automatically |
| 12 | Select several files | Batch table with results and trust scores |
| 13 | Check a file named `setup.exe` | Executable warning |
| 14 | Export backup, clear history, import backup | Data restored |
| 15 | Tamper Demo: change 1000 to 9000 | Most hash characters change |

## Deploy to GitHub Pages
Push to the `main` branch. In the repository go to Settings, Pages, and set Source to GitHub Actions. The included workflow builds and deploys the site.

## Note
A matching hash proves the file equals the reference. Always get the reference hash from a trusted source that is separate from the download.
