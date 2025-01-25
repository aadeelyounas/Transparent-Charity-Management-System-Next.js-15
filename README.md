# Transparent Charity Management System (Next.js 15)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, mobile-first, responsive Next.js 15 application for managing charity organizations with complete transparency and security.

## Features

- **User Roles**
  - Donors can:
    - View their donation history
    - See transparent distribution records
  - Admins can:
    - Manage users and donations
    - Track fund distributions
    - Generate financial reports

- **Modern Tech Stack**
  - Next.js 15 with React 18+
  - Tailwind CSS for styling
  - PostgreSQL database
  - NextAuth.js authentication
  - TypeScript support

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Git

### Installation
1. Clone the repository
```bash
git clone https://github.com/aadeelyounas/transparent-charity-management-system-nextjs15.git
cd transparent-charity-management-system-nextjs15
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Update the .env file with your credentials
```

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Start the development server
```bash
npm run dev
```

## Contributing
We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Inspired by the need for transparent charity management systems
- Built with ❤️ by the open source community
