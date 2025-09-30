# CA Lobby Search System - Claude Code Reference

**Project:** California Lobby Search System
**Project Code:** CA_LOBBY
**Current Status:** Phase 2b - State Management Implementation
**Last Updated:** September 28, 2025

> **⚠️ CRITICAL REFERENCE**: Always consult [`Documentation/General/MASTER_PROJECT_PLAN.md`](Documentation/General/MASTER_PROJECT_PLAN.md) before planning or executing any new phase.


## 🎯 Project Overview

### Mission Statement
Create a comprehensive, publicly accessible search system for California lobby data that enables transparency and analysis of lobbying activities, expenditures, and associations.

### Current Architecture
- **Frontend**: React app with Clerk authentication (`src/`)
- **Backend**: Flask API with BigQuery integration (`webapp/backend/`)
- **Database**: BigQuery (data processing files preserved in main branch)
- **Deployment**: Vercel with automated builds
- **Data Source**: Big Local News (BLN) API

## 📋 Current Project Status

### ✅ Completed Phases
- **Phase 1.1**: Foundation and Data Pipeline Infrastructure (COMPLETED)
- **Phase 1.2**: Enhanced Deployment Pipeline (COMPLETED)
- **Phase 1.3**: Frontend-Backend Integration (COMPLETED)
- **Phase 2a.1**: Component Structure Documentation (COMPLETED)
- **Phase 2a.2**: Enhancement Strategy Definition (COMPLETED)

### 🎯 Current Phase: Phase 2b - State Management Implementation
**Duration**: 2 days
**Next Milestone**: Phase 2b.1 - State Management Decision

**Objective**: Choose and implement state management solution (Redux/Zustand) for enhanced features.

**Micro Save Points**:
- **2b.1**: State Management Decision (Day 3, 4 hours)
- **2b.2**: State Management Implementation (Day 4, 4 hours)

### 📅 Upcoming Phases
- **Phase 2c**: Visualization Library Decision (Days 5-6)
- **Phase 2d**: Mobile-First CSS Strategy (Days 7-8)
- **Phase 2e**: API Design Specification (Days 9-10)
- **Phase 2.1**: Advanced Search and Analytics (January 2026)

## ⚡ Development Commands

### Frontend Development
```bash
# Start React development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Install dependencies
npm install
```

### Backend Development
```bash
# Navigate to backend
cd webapp/backend

# Install Python dependencies
pip install -r requirements.txt

# Run Flask development server
python run.py

# Run tests
python -m pytest tests/
```

### Deployment
```bash
# Deploy to Vercel (automatic on push to main)
vercel --prod

# Local Vercel preview
vercel dev
```

## 📁 Key File Locations

### Frontend Structure
```
src/
├── components/           # React components
│   ├── Dashboard.js     # Main dashboard
│   ├── Search.js        # Search functionality
│   ├── Analytics.js     # Analytics views
│   ├── Reports.js       # Report generation
│   └── Settings.js      # User settings
├── App.js               # Main app component
└── index.js             # Entry point
```

### Backend Structure
```
webapp/backend/
├── app.py               # Flask application
├── auth.py              # Authentication logic
├── data_service.py      # Data access layer
├── database.py          # Database connections
├── middleware.py        # Request middleware
├── requirements.txt     # Python dependencies
└── run.py               # Development server
```

### Configuration Files
- `package.json` - Frontend dependencies and scripts
- `vercel.json` - Deployment configuration
- `.env` - Environment variables (not tracked)
- `.gitignore` - Git ignore patterns

## 📚 Documentation Structure

### Always Reference First
**[`Documentation/General/MASTER_PROJECT_PLAN.md`](Documentation/General/MASTER_PROJECT_PLAN.md)** - **MANDATORY reading before any phase planning or execution**

### Organized Documentation
```
Documentation/
├── General/              # Project-wide documentation
│   ├── MASTER_PROJECT_PLAN.md     # ⭐ PRIMARY REFERENCE
│   ├── COMMIT_STRATEGY.md         # Development workflow
│   └── CLAUDE_CODE_SETUP_GUIDE.md # Claude setup
├── Phase1/
│   ├── Plans/            # Phase 1 planning documents
│   └── Reports/          # Phase 1 completion reports
├── Phase2/
│   ├── Plans/            # Phase 2 planning documents
│   └── Reports/          # Phase 2 completion reports
├── Deployment/           # Infrastructure documentation
└── README.md             # Documentation navigation guide
```

## 🔄 Phase Planning & Execution Protocol

### Before Starting Any New Phase:

1. **📖 READ MASTER PLAN**: Review [`Documentation/General/MASTER_PROJECT_PLAN.md`](Documentation/General/MASTER_PROJECT_PLAN.md)
2. **📊 Check Current Status**: Verify current phase completion in master plan
3. **📋 Review Prerequisites**: Ensure all dependencies are met
4. **📝 Create Phase Plan**: Document in appropriate `Documentation/PhaseX/Plans/` directory
5. **🎯 Define Save Points**: Break down into micro save points following established patterns

### During Phase Execution:

1. **📊 Track Progress**: Update todo lists and progress indicators
2. **💾 Micro Save Points**: Commit granular changes following [`Documentation/General/COMMIT_STRATEGY.md`](Documentation/General/COMMIT_STRATEGY.md)
3. **📝 Document Issues**: Record any deviations or issues encountered
4. **🔄 Update Status**: Keep master plan status current

### After Phase Completion:

1. **📄 Create Completion Report**: Document in `Documentation/PhaseX/Reports/`
2. **✅ Update Master Plan**: **MANDATORY** - Update [`Documentation/General/MASTER_PROJECT_PLAN.md`](Documentation/General/MASTER_PROJECT_PLAN.md) with:
   - Mark phase as ✅ COMPLETED with completion date
   - Add reference to the phase completion report
   - Update current status to next phase
   - Document key achievements and metrics
3. **🔗 Cross-Reference**: Link completion report in master plan documentation index
4. **🔄 Prepare Next Phase**: Reference updated master plan for next phase requirements
5. **🚀 Deploy/Test**: Ensure phase deliverables are fully deployed and tested

## 📊 Master Plan Maintenance Protocol

### Critical Requirement
**The master plan MUST be updated after every phase completion** - this is not optional!

### Master Plan Update Checklist
When completing any phase:

1. **✅ Status Update**: Change phase status from "🎯 NEXT" or "🔄 IN PROGRESS" to "✅ COMPLETED"
2. **📅 Date Recording**: Add actual completion date
3. **📄 Report Reference**: Add link to completion report in documentation index
4. **📈 Metrics Update**: Record actual vs. planned metrics and achievements
5. **🔄 Next Phase**: Update "Current Phase" section to reflect next phase
6. **⚠️ Issues**: Document any deviations from plan or lessons learned

### Example Master Plan Update
```markdown
#### Phase 2b: State Management Implementation ✅ COMPLETED
**Duration:** September 28-29, 2025 (2 days)
**Status:** ✅ COMPLETED

**Deliverables Achieved:**
- ✅ State management decision (Zustand selected)
- ✅ Implementation completed
- ✅ Integration with existing components

**Reference Documents:**
- **Completion Report**: [`Documentation/Phase2/Reports/PHASE_2B_COMPLETION_REPORT.md`](Documentation/Phase2/Reports/PHASE_2B_COMPLETION_REPORT.md)
```

## 🚨 Critical Reminders

### Data Processing Files
- **Location**: Data processing files are preserved in the `main` branch
- **Current Branch**: `working_branch` is focused on web application only
- **Access**: Switch to `main` branch to access BigQuery integration scripts

### Branch Management
- **Main Branch**: Contains full project including data processing
- **Working Branch**: Web application focus (current)
- **Deployment**: Automated via Vercel on branch pushes

### Authentication
- **System**: Clerk authentication integrated
- **Configuration**: Managed through Clerk dashboard
- **Implementation**: See `src/` components and `webapp/backend/auth.py`

## 🔧 Common Tasks

### Adding New Features
1. Reference master plan for feature alignment
2. Follow Phase 2 enhancement strategy (see `Documentation/Phase2/Plans/`)
3. Enhance existing components rather than creating new ones
4. Update state management as needed (Phase 2b focus)

### Debugging
- **Frontend**: Browser dev tools + React Dev Tools
- **Backend**: Flask debug mode + logs in `webapp/backend/logs/`
- **Deployment**: Vercel dashboard for build/runtime logs

### Testing
- **Frontend**: `npm test` (Jest + React Testing Library)
- **Backend**: `python -m pytest tests/`
- **Integration**: Manual testing + deployment validation

## 📞 Quick References

### Key URLs
- **Production**: https://ca-lobby-webapp.vercel.app (check latest deployment)
- **Vercel Dashboard**: Project deployments and logs
- **Clerk Dashboard**: Authentication management

### Important Files to Reference
- [`Documentation/General/MASTER_PROJECT_PLAN.md`](Documentation/General/MASTER_PROJECT_PLAN.md) - **Primary planning document**
- [`Documentation/General/COMMIT_STRATEGY.md`](Documentation/General/COMMIT_STRATEGY.md) - Development workflow
- [`Documentation/Phase2/Plans/PHASE_2_PREPARATION_IMPLEMENTATION_PLAN.md`](Documentation/Phase2/Plans/PHASE_2_PREPARATION_IMPLEMENTATION_PLAN.md) - Current phase planning

---

## 🎯 Next Immediate Action

**Phase 2b.1: State Management Decision**
- Choose between Redux and Zustand
- Document decision rationale
- Reference: Phase 2 preparation plan for detailed requirements

**Remember**: Always consult the master plan before proceeding with any phase planning or execution!

---

**Last Updated**: September 28, 2025
**Next Review**: Phase 2b completion
**Maintained By**: CA Lobby Project Team