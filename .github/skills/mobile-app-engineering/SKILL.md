---
name: mobile-app-engineering
description: Build and maintain Flutter/Dart or React Native/Expo mobile apps, including navigation, state, API integration, native behavior, tests and release readiness.
---

# Mobile application engineering

First identify whether the project is Flutter, React Native CLI or Expo. Do not mix their tooling.

## Shared requirements
- Inspect current architecture, navigation, state management, supported OS versions and dependencies.
- Implement platform-aware responsive UI, safe areas, keyboard behavior and accessible controls.
- Model loading, empty, error, retry, offline and permission-denied states.
- Centralize API clients, serialization, auth/session handling and error mapping.
- Never embed private API keys or server secrets in the app.
- Handle lifecycle, cancellation, duplicate submissions and flaky networks.
- Add tests for business logic and critical screen/navigation flows.
- Verify builds using the commands supported by the actual environment.

## Flutter
- Follow existing Dart style, null safety, package versions, routing and state management (do not impose BLoC/Riverpod/Provider).
- Prefer small widgets and explicit immutable UI state.
- Use `flutter analyze`, relevant `flutter test` suites and a build for the target platform when available.
- Respect Android/iOS permissions, signing and platform configuration.

## React Native / Expo
- Follow the project's Expo SDK or React Native version; use `npx expo install` for Expo-compatible native dependencies.
- Respect Expo Router or existing navigation choice.
- Use platform-specific files only when needed.
- Test native modules on a real simulator/device where possible; web preview alone does not prove native correctness.
- Use EAS only when the project actually uses it; disclose any paid build/distribution step.
