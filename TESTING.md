# Testing Documentation

CareCircle AI includes automated unit and integration tests run via Vitest.

## Running Tests

```bash
npm test
```

## Test Coverage
- **Adherence Calculation Logic:** Verifies accurate percentage calculations, proper handling of missed vs taken doses, and risk pattern trigger detection.
- **Production Build Validation:** Executed via `npm run build` checking static page generation and dynamic route compilation across all 14 routes.

