# Security Policy

## Supported Versions

KeyFlow is a client-only application with no backend, database, or
authentication layer. The current `main` branch is the only actively
supported version.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

KeyFlow does not collect, transmit, or store any personal data on a
server — all data lives in the user's own browser `localStorage`.
Even so, if you discover a security issue (for example, an XSS vector,
a dependency vulnerability, or unsafe handling of user input), please
report it responsibly:

1. **Do not** open a public issue for security vulnerabilities.
2. Email the maintainers or use GitHub's private
   [Security Advisories](https://docs.github.com/en/code-security/security-advisories)
   feature on this repository.
3. Include steps to reproduce, the affected version/commit, and the
   potential impact.

We aim to acknowledge reports within **5 business days** and to release a
fix or mitigation as quickly as possible once a report is confirmed.

## Scope Notes

- KeyFlow makes **no network requests** to third-party services at
  runtime beyond loading fonts/assets bundled at build time.
- There is no authentication, session, or user-account system to
  compromise.
- Dependency vulnerabilities (via `npm audit`) are still in scope —
  please report those too.
