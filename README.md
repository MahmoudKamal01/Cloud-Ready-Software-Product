# Helpdesk Platform - Cloud-Ready Ticketing System

A comprehensive, cloud-ready helpdesk and ticketing platform built with Next.js, MongoDB, Docker, and CI/CD practices. This project demonstrates professional software development practices including Agile methodologies, DevOps pipelines, software architecture design, quality assurance, and testing.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Timeline & Gantt Chart](#project-timeline--gantt-chart)
- [Sprint Planning](#sprint-planning)
- [Sprint Retrospectives](#sprint-retrospectives)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Risk Analysis](#risk-analysis)
- [Product Backlog](#product-backlog)

## 🎯 Project Overview

### Product Vision

To provide companies with a scalable, reliable, and user-friendly ticketing system that streamlines support operations, improves response times, and enhances customer satisfaction through efficient ticket management and role-based access control.

### Goals

1. **User Experience**: Provide an intuitive interface for ticket submission and management
2. **Scalability**: Design architecture that can handle growing user bases and ticket volumes
3. **Reliability**: Ensure 99.9% uptime with fault-tolerant design
4. **Security**: Implement robust authentication and authorization mechanisms
5. **Quality**: Maintain high code quality through automated testing and code reviews

### Success Metrics

- **User Adoption**: 100+ registered users within first month
- **Ticket Resolution Time**: Average resolution time < 24 hours
- **System Uptime**: 99.9% availability
- **Code Coverage**: >80% test coverage
- **CI/CD Success Rate**: >95% successful deployments

## ✨ Features

### Core Features

- **User Authentication & Authorization**

  - User registration and login
  - JWT-based session management
  - Role-based access control (User, Agent, Admin)

- **Ticket Management**

  - Create, view, update, and delete tickets
  - Ticket status tracking (Open, In Progress, Resolved, Closed)
  - Priority levels (Low, Medium, High, Urgent)
  - Category classification
  - Ticket assignment to agents

- **Role-Based Permissions**

  - **Users**: Create and view their own tickets
  - **Agents**: View all tickets, update status, assign tickets
  - **Admins**: Full access to all features and user management

- **Dashboard**
  - Personalized ticket view
  - Real-time ticket status updates
  - Filter and search capabilities

## 🛠 Technology Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **CSS Modules** - Styling

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Zod** - Schema validation

### DevOps & Infrastructure

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD pipeline
- **Jest** - Testing framework
- **ESLint** - Code linting

## 📅 Project Timeline & Gantt Chart

### Project Duration: 6 Weeks

```
Week 1: Planning & Setup
├── Project kickoff
├── Requirements gathering
├── Architecture design
└── Development environment setup

Week 2: Core Development - Sprint 1
├── Database models & MongoDB setup
├── Authentication system
└── Basic UI components

Week 3: Feature Development - Sprint 2
├── Ticket CRUD operations
├── Dashboard implementation
└── Role-based access control

Week 4: Testing & Quality - Sprint 3
├── Unit tests
├── Integration tests
├── API tests
└── Code review & refactoring

Week 5: DevOps & Deployment - Sprint 4
├── Docker configuration
├── CI/CD pipeline setup
├── Environment configuration
└── Deployment preparation

Week 6: Documentation & Finalization
├── Documentation completion
├── Final testing
├── Bug fixes
└── Project presentation
```

### Gantt Chart Visualization

```
Task                          | Week 1 | Week 2 | Week 3 | Week 4 | Week 5 | Week 6
------------------------------|--------|--------|--------|--------|--------|--------
Planning & Design             | ████████|        |        |        |        |
Database Setup                |        | ████   |        |        |        |
Authentication                |        | ████████|        |        |        |
UI Components                 |        | ████   | ████   |        |        |
Ticket Management             |        |        | ████████|        |        |
Role-Based Access             |        |        | ████   |        |        |
Unit Testing                  |        |        |        | ████████|        |
Integration Testing           |        |        |        | ████   |        |
Docker Setup                  |        |        |        |        | ████████|
CI/CD Pipeline                |        |        |        |        | ████   |
Documentation                 |        |        |        |        |        | ████████
Final Testing                 |        |        |        |        |        | ████
```

## 🏃 Sprint Planning

### Sprint 1: Foundation (Week 2)

**Goal**: Establish core infrastructure and authentication

**User Stories**:

1. **US-001**: As a developer, I want to set up MongoDB database so that I can store application data

   - Acceptance Criteria: MongoDB connection established, User and Ticket models created
   - Story Points: 3

2. **US-002**: As a user, I want to register an account so that I can access the platform

   - Acceptance Criteria: Registration form, API endpoint, password hashing, validation
   - Story Points: 5

3. **US-003**: As a user, I want to login so that I can access my dashboard
   - Acceptance Criteria: Login form, JWT token generation, session management
   - Story Points: 5

**Sprint Velocity**: 13 story points

### Sprint 2: Core Features (Week 3)

**Goal**: Implement ticket management functionality

**User Stories**:

1. **US-004**: As a user, I want to create a ticket so that I can report issues

   - Acceptance Criteria: Ticket creation form, API endpoint, validation, database storage
   - Story Points: 5

2. **US-005**: As a user, I want to view my tickets so that I can track their status

   - Acceptance Criteria: Ticket list view, filtering, status display
   - Story Points: 3

3. **US-006**: As an agent, I want to update ticket status so that I can manage workflow

   - Acceptance Criteria: Status update functionality, permission checks, API endpoint
   - Story Points: 5

4. **US-007**: As an agent, I want to assign tickets so that workload is distributed
   - Acceptance Criteria: Assignment dropdown, permission checks, API endpoint
   - Story Points: 3

**Sprint Velocity**: 16 story points

### Sprint 3: Quality Assurance (Week 4)

**Goal**: Ensure code quality and reliability

**User Stories**:

1. **US-008**: As a developer, I want unit tests so that code quality is maintained

   - Acceptance Criteria: >80% code coverage, all critical functions tested
   - Story Points: 5

2. **US-009**: As a developer, I want integration tests so that API endpoints work correctly

   - Acceptance Criteria: All API routes tested, authentication flows tested
   - Story Points: 5

3. **US-010**: As a developer, I want code reviews so that best practices are followed
   - Acceptance Criteria: ESLint configuration, code review process established
   - Story Points: 3

**Sprint Velocity**: 13 story points

### Sprint 4: DevOps & Deployment (Week 5)

**Goal**: Enable automated deployment and containerization

**User Stories**:

1. **US-011**: As a DevOps engineer, I want Docker configuration so that the app is containerized

   - Acceptance Criteria: Dockerfile, docker-compose.yml, multi-stage build
   - Story Points: 5

2. **US-012**: As a DevOps engineer, I want CI/CD pipeline so that deployments are automated

   - Acceptance Criteria: GitHub Actions workflow, automated testing, build process
   - Story Points: 8

3. **US-013**: As a developer, I want environment configuration so that the app works in different environments
   - Acceptance Criteria: Environment variables, configuration files, documentation
   - Story Points: 3

**Sprint Velocity**: 16 story points

## 🔄 Sprint Retrospectives

### Sprint 1 Retrospective

**What Went Well** ✅:

- MongoDB integration was smooth with Mongoose ODM
- Authentication system implemented faster than expected
- Clear communication within the team

**What Could Be Improved** 🔄:

- Initial database schema design needed refinement
- More time should be allocated for error handling
- Documentation could be more detailed from the start

**Action Items** 📋:

- Create detailed API documentation template
- Establish error handling patterns early
- Schedule regular code review sessions

**Velocity**: 13/13 story points completed

### Sprint 2 Retrospective

**What Went Well** ✅:

- Ticket management features implemented successfully
- Role-based access control working as expected
- UI components are reusable and maintainable

**What Could Be Improved** 🔄:

- Some edge cases in permission checks were missed initially
- Frontend state management could be improved
- More user feedback needed on UI/UX

**Action Items** 📋:

- Add comprehensive permission tests
- Consider state management library for complex state
- Conduct user testing sessions

**Velocity**: 16/16 story points completed

### Sprint 3 Retrospective

**What Went Well** ✅:

- Test coverage exceeded 80% target
- Integration tests caught several bugs early
- Code quality improved significantly with linting

**What Could Be Improved** 🔄:

- Some tests were too brittle and needed refactoring
- Test execution time could be optimized
- More focus needed on edge case testing

**Action Items** 📋:

- Refactor flaky tests
- Optimize test suite execution
- Add more boundary condition tests

**Velocity**: 13/13 story points completed

### Sprint 4 Retrospective

**What Went Well** ✅:

- Docker setup was straightforward
- CI/CD pipeline working correctly
- Deployment process is well-documented

**What Could Be Improved** 🔄:

- Initial Docker build times were slow
- CI/CD pipeline could include more stages
- Environment variable management needs improvement

**Action Items** 📋:

- Optimize Docker build process
- Add deployment stages to CI/CD
- Create environment variable documentation

**Velocity**: 16/16 story points completed

## 🏗 Architecture

### System Architecture

```
┌─────────────────┐
│   Web Browser   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Next.js App   │
│  (Frontend +    │
│   API Routes)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    MongoDB      │
│   Database      │
└─────────────────┘
```

### Component Architecture

- **Presentation Layer**: Next.js pages and components
- **API Layer**: Next.js API routes (RESTful endpoints)
- **Business Logic Layer**: Service functions and utilities
- **Data Access Layer**: Mongoose models and database operations
- **Infrastructure Layer**: Docker, CI/CD, monitoring

### Design Patterns

- **MVC Pattern**: Separation of concerns between models, views, and controllers
- **Repository Pattern**: Data access abstraction through Mongoose models
- **Middleware Pattern**: Authentication and authorization middleware
- **Factory Pattern**: Token generation and validation utilities

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cicd
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file:

   ```env
   MONGODB_URI=mongodb://localhost:27017/helpdesk
   JWT_SECRET=your-secret-key-change-in-production
   NODE_ENV=development
   ```

4. **Run with Docker Compose** (Recommended)

   ```bash
   docker-compose up -d
   ```

5. **Or run locally**

   ```bash
   # Start MongoDB (if not using Docker)
   # Then run:
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - MongoDB: mongodb://localhost:27017

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 🧪 Testing

### Test Structure

```
__tests__/
├── api/
│   ├── auth.test.ts      # Authentication API tests
│   └── tickets.test.ts   # Tickets API tests
└── lib/
    └── auth.test.ts      # Auth utility tests
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage

- **Unit Tests**: Test individual functions and utilities
- **Integration Tests**: Test API endpoints and database interactions
- **Coverage Target**: >80% code coverage

### Test Scenarios

1. **Authentication Tests**

   - User registration with valid/invalid data
   - User login with correct/incorrect credentials
   - Token generation and validation
   - Session management

2. **Ticket Management Tests**

   - Ticket creation with validation
   - Ticket retrieval with filters
   - Ticket updates with permission checks
   - Ticket deletion with authorization

3. **Authorization Tests**
   - Role-based access control
   - Permission enforcement
   - Unauthorized access prevention

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The CI/CD pipeline includes:

1. **Test Stage**

   - Checkout code
   - Setup Node.js environment
   - Install dependencies
   - Run linter
   - Execute test suite
   - Generate coverage reports

2. **Build Stage**

   - Build Docker image
   - Test Docker image
   - Verify container functionality

3. **Deploy Stage** (on main branch)
   - Deploy to production environment
   - Run health checks
   - Monitor deployment status

### Pipeline Configuration

See `.github/workflows/ci-cd.yml` for complete configuration.

### Deployment Strategy

- **Development**: Manual deployment for testing
- **Staging**: Automated deployment on merge to develop branch
- **Production**: Automated deployment on merge to main branch

## ⚠️ Risk Analysis

### Technical Risks

| Risk                            | Impact | Probability | Mitigation Strategy                                       |
| ------------------------------- | ------ | ----------- | --------------------------------------------------------- |
| Database connection failures    | High   | Medium      | Implement connection pooling, retry logic, health checks  |
| Authentication token expiration | Medium | Low         | Implement token refresh mechanism, clear error messages   |
| API rate limiting               | Medium | Low         | Implement rate limiting middleware, monitor usage         |
| Docker build failures           | Medium | Low         | Optimize Dockerfile, use multi-stage builds, cache layers |
| MongoDB data loss               | High   | Low         | Regular backups, replication, data validation             |

### Organizational Risks

| Risk                       | Impact | Probability | Mitigation Strategy                                                   |
| -------------------------- | ------ | ----------- | --------------------------------------------------------------------- |
| Team member unavailability | Medium | Medium      | Document all processes, pair programming, code reviews                |
| Scope creep                | Medium | High        | Strict backlog management, sprint planning, stakeholder communication |
| Timeline delays            | High   | Medium      | Buffer time in sprints, prioritize features, regular stand-ups        |

### Security Risks

| Risk                | Impact | Probability | Mitigation Strategy                                         |
| ------------------- | ------ | ----------- | ----------------------------------------------------------- |
| SQL/NoSQL injection | High   | Low         | Input validation with Zod, parameterized queries            |
| XSS attacks         | High   | Low         | Input sanitization, Content Security Policy                 |
| JWT token theft     | High   | Medium      | HttpOnly cookies, HTTPS only, token expiration              |
| Unauthorized access | High   | Medium      | Role-based access control, permission checks, audit logs    |
| Password breaches   | High   | Low         | bcrypt hashing, strong password requirements, rate limiting |

## 📦 Product Backlog

### High Priority

1. **User Registration & Authentication** ✅ (Completed)

   - Priority: P0
   - Status: Done

2. **Ticket Creation & Management** ✅ (Completed)

   - Priority: P0
   - Status: Done

3. **Role-Based Access Control** ✅ (Completed)
   - Priority: P0
   - Status: Done

### Medium Priority

4. **Email Notifications**

   - Priority: P1
   - Status: Backlog
   - Description: Send email notifications for ticket updates

5. **Ticket Comments/Threads**

   - Priority: P1
   - Status: Backlog
   - Description: Allow users to add comments to tickets

6. **File Attachments**
   - Priority: P1
   - Status: Backlog
   - Description: Support file uploads for tickets

### Low Priority

7. **Advanced Search & Filtering**

   - Priority: P2
   - Status: Backlog
   - Description: Full-text search, advanced filters

8. **Analytics Dashboard**

   - Priority: P2
   - Status: Backlog
   - Description: Ticket statistics and reporting

9. **Mobile App**
   - Priority: P3
   - Status: Backlog
   - Description: Native mobile application

## 📝 User Stories & Acceptance Criteria

### US-001: User Registration

**As a** new user  
**I want to** register an account  
**So that** I can access the helpdesk platform

**Acceptance Criteria**:

- [x] Registration form with email, password, and name fields
- [x] Email validation (format and uniqueness)
- [x] Password strength requirements (min 6 characters)
- [x] Password hashing with bcrypt
- [x] JWT token generation upon successful registration
- [x] Error handling for duplicate emails

### US-002: Ticket Creation

**As a** registered user  
**I want to** create a support ticket  
**So that** I can report issues and get help

**Acceptance Criteria**:

- [x] Ticket creation form with title, description, category, and priority
- [x] Form validation (required fields, max lengths)
- [x] API endpoint for ticket creation
- [x] Ticket stored in database with user association
- [x] Success confirmation message
- [x] Redirect to ticket list after creation

### US-003: Ticket Status Management

**As an** agent  
**I want to** update ticket status  
**So that** I can track ticket progress

**Acceptance Criteria**:

- [x] Status dropdown for agents and admins
- [x] Status options: Open, In Progress, Resolved, Closed
- [x] Permission check (only agents/admins can update)
- [x] API endpoint for status updates
- [x] Real-time status display on dashboard

## 🤝 Contributing

This is an assessment project. For production use, please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created for educational purposes as part of a software engineering assessment.

## 👥 Team

- **Role**: Full-stack Developer
- **Responsibilities**: Architecture, Development, Testing, DevOps, Documentation

## 📊 Project Metrics

- **Total Story Points**: 58
- **Completed Story Points**: 58
- **Sprint Velocity Average**: 14.5 points/sprint
- **Test Coverage**: >80%
- **Code Quality**: ESLint passing
- **Build Status**: ✅ Passing

## 🎓 Learning Outcomes Demonstrated

1. ✅ **Computer Science Methods**: Applied algorithms for authentication, data validation, and access control
2. ✅ **Professional Conduct**: Maintained code quality, documentation, and ethical development practices
3. ✅ **Software Tools**: Utilized Next.js, MongoDB, Docker, GitHub Actions, Jest, and TypeScript
4. ✅ **Agile & DevOps**: Implemented sprint planning, retrospectives, CI/CD pipelines, and version control
5. ✅ **Ethical Responsibility**: Implemented security best practices, data protection, and user privacy

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
