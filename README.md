# MCP Directory

A beautiful, fast, and scalable directory for Model Context Protocol (MCP) servers. Built with Astro, Tailwind CSS, and deployed on Cloudflare's edge network.

## ✨ Features

- **🔍 Advanced Search & Filtering** - Find MCP servers by name, description, tags, and more
- **📊 GitHub Integration** - Automatically sync repository information, stars, and README files
- **👤 User Authentication** - Secure user registration and login system
- **📱 Responsive Design** - Beautiful UI that works on all devices
- **⚡ Lightning Fast** - Built with Astro for optimal performance
- **🌙 Dark/Light Mode** - Toggle between themes
- **🔒 Secure** - JWT authentication and input validation
- **📈 Analytics Ready** - Built-in stats and community metrics
- **🚀 Cloudflare Powered** - Deployed on Cloudflare's global network

## 🛠 Tech Stack

- **Frontend**: Astro, Tailwind CSS, DaisyUI
- **Backend**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Authentication**: JWT tokens
- **Deployment**: Cloudflare Pages
- **Styling**: Tailwind CSS + DaisyUI
- **Icons**: Lucide Icons

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Cloudflare account
- Wrangler CLI (`npm install -g wrangler`)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mcp-directory.git
cd mcp-directory
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Cloudflare D1 Database

```bash
# Create D1 database
wrangler d1 create mcp-directory-prod

# Create staging database
wrangler d1 create mcp-directory-staging

# Update wrangler.toml with your database IDs
```

### 4. Initialize Database Schema

```bash
# Apply schema to production
wrangler d1 execute mcp-directory-prod --file=./schema.sql

# Apply schema to staging
wrangler d1 execute mcp-directory-staging --file=./schema.sql
```

### 5. Configure Environment Variables

Update `wrangler.toml` with your settings:

```toml
[env.production.vars]
JWT_SECRET = "your-super-secret-jwt-key"
ENVIRONMENT = "production"
```

### 6. Development

```bash
# Start development server
npm run dev

# The site will be available at http://localhost:4321
```

### 7. Deploy to Cloudflare

```bash
# Deploy to production
wrangler pages deploy dist --project-name=mcp-directory

# Or deploy to staging
wrangler pages deploy dist --project-name=mcp-directory-staging
```

## 📁 Project Structure

```
mcp-directory/
├── src/
│   ├── components/          # Reusable UI components
│   ├── layouts/            # Page layouts
│   ├── lib/               # Utility functions
│   │   ├── auth.js        # Authentication utilities
│   │   ├── database.js    # Database operations
│   │   └── github.js      # GitHub API integration
│   ├── pages/             # Route pages
│   │   ├── api/          # API endpoints
│   │   ├── auth/         # Authentication pages
│   │   ├── servers/      # Server-related pages
│   │   └── index.astro   # Homepage
│   └── styles/           # Global styles
├── schema.sql            # Database schema
├── wrangler.toml        # Cloudflare configuration
├── astro.config.mjs     # Astro configuration
├── tailwind.config.mjs  # Tailwind configuration
└── package.json
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `ENVIRONMENT` | Environment (production/staging) | Yes |

### Database Configuration

The application uses Cloudflare D1 (SQLite) with the following tables:

- `users` - User accounts and profiles
- `servers` - MCP server listings

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

#### Servers
- `GET /api/servers` - List all servers
- `POST /api/servers` - Create new server (authenticated)
- `GET /api/servers/[slug]` - Get server by slug
- `PUT /api/servers/[slug]` - Update server (authenticated)
- `DELETE /api/servers/[slug]` - Delete server (authenticated)

## 🎨 Customization

### Styling

The project uses Tailwind CSS with DaisyUI components. You can customize:

- **Colors**: Update `tailwind.config.mjs` for custom color schemes
- **Themes**: DaisyUI provides built-in light/dark themes
- **Components**: Modify components in `src/components/`

### GitHub Integration

The platform automatically fetches repository information:

- Repository name and description
- Star and fork counts
- README content
- Repository topics as tags
- Owner information

## 🚀 Deployment

### Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure environment variables in Cloudflare dashboard

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy with Wrangler
wrangler pages deploy dist --project-name=mcp-directory
```

## 📊 Analytics

The platform includes built-in analytics:

- Server view counts
- User engagement metrics
- Community growth statistics
- Popular tags and categories

## 🔒 Security

- JWT-based authentication
- Input validation on all endpoints
- XSS protection for markdown content
- Rate limiting on API endpoints
- Secure password hashing with bcrypt

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/mcp-directory/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/mcp-directory/discussions)
- **Documentation**: [Wiki](https://github.com/your-username/mcp-directory/wiki)

## 🙏 Acknowledgments

- [Astro](https://astro.build/) - The web framework for content-driven websites
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [DaisyUI](https://daisyui.com/) - The most popular component library for Tailwind CSS
- [Cloudflare](https://cloudflare.com/) - The platform powering our infrastructure
- [Model Context Protocol](https://github.com/modelcontextprotocol) - The protocol this directory serves

## 📈 Roadmap

- [ ] Advanced search with filters
- [ ] User profiles and social features
- [ ] Server categories and collections
- [ ] API documentation generator
- [ ] Mobile app
- [ ] Integration with more platforms
- [ ] Community voting and reviews
- [ ] Advanced analytics dashboard

---

Built with ❤️ by the MCP community
