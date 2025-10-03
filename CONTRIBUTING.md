# Contributing to Dodo Payments Ingestion Blueprints

Thank you for your interest in contributing to the Dodo Payments Ingestion Blueprints! This document provides guidelines and information for contributors.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [contact email].

## How to Contribute

### Reporting Issues

Before creating an issue, please check if a similar issue already exists. When creating an issue, please use the provided issue template and include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Environment information (OS, Node.js version, package version)
- Any relevant code examples

### Suggesting Enhancements

We welcome suggestions for new features or improvements. Please use the issue template and clearly describe:

- The feature or enhancement you'd like to see
- Why this would be useful
- Any potential implementation ideas

### Pull Requests

1. **Fork the repository** and create a new branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if necessary
5. **Submit a pull request** using the provided template

## Development Setup

### Prerequisites

- Node.js 18+ 
- Bun (recommended) or npm
- Git

### Getting Started

1. Clone your fork:
   ```bash
   git clone https://github.com/your-username/ingestion-blueprints.git
   cd ingestion-blueprints
   ```

2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```

3. Build the project:
   ```bash
   bun run build
   # or
   npm run build
   ```

4. Run tests:
   ```bash
   bun test
   # or
   npm test
   ```

## Coding Standards

### TypeScript

- Use TypeScript for all code
- Prefer interfaces over types
- Use functional programming patterns
- Avoid classes unless absolutely necessary
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`)

### Code Style

- Follow the existing code style and patterns
- Use meaningful commit messages
- Keep functions small and focused
- Add JSDoc comments for public APIs
- Use consistent indentation (2 spaces)

### File Structure

- Use lowercase with dashes for directories
- Favor named exports for components
- Group related functionality together
- Keep files focused and modular

## Testing

- Write tests for new features and bug fixes
- Ensure all tests pass before submitting a PR
- Aim for good test coverage
- Use descriptive test names

## Documentation

- Update README.md if you add new features
- Add JSDoc comments for new public APIs
- Update type definitions if needed
- Include usage examples where appropriate

## Commit Guidelines

We follow conventional commits. Please format your commit messages as:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## Release Process

Releases are automatically published to npm when a new tag is created. The workflow:

1. Update version in `package.json`
2. Create a git tag with the same version (e.g., `v1.0.1`)
3. Push the tag to trigger the release workflow
4. The package will be automatically published to npm

## Questions?

If you have any questions about contributing, please:

1. Check existing issues and discussions
2. Create a new issue with the "question" label
3. Contact the maintainers directly

## License

By contributing to this project, you agree that your contributions will be licensed under the GNU General Public License v3.0.
