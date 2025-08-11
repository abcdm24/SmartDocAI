# Changelog

## [1.1] - 2025-08-11

### Added
- **Authentication feature** across backend, web app, and mobile app:
  - Implemented JWT-based authentication in  backend.
  - Added  with  and  endpoints.
  - Updated database to store user credentials securely using password hashing (BCrypt).
  - Configured  and middleware for token validation.
  - Added  for React Web App and guarded screens for React Native Mobile App.
  - Implemented  and  in both web and mobile for centralized auth state.
  - Added login/logout UI and user profile name display in the navbar for the web app.
  - Mobile app now supports login/logout and redirects to protected features after authentication.

### Changed
- Updated **UI polish** for Login and Register screens (Web & Mobile).
- Modified **Layout components** in mobile app to work with authentication state and navigation.
- Integrated authentication checks into existing SmartDocAI features (, , ) so they require login.

### Fixed
- Minor UI alignment and navigation issues in mobile app screens.
- Corrected API error handling for authentication failures in frontend apps.

---

## [1.0] - 2025-07-18

### Added
- Initial release of SmartDocAI solution:
  - Document upload, text extraction, summarization, and AI query features.
  - Backend (), React Web App frontend, and React Native Mobile App setup.

