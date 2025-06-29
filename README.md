# ⚖️ Legal Case Management System

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)

**A comprehensive, full-stack web application designed to streamline legal case management, document automation, and client interactions for law firms and legal departments.**

[🎥 **Watch Demo Video**](https://youtu.be/TozTdIsqyVQ) | [📋 **Features**](#-features) | [🚀 **Quick Start**](#-quick-start) | [📖 **Documentation**](#-documentation)

</div>

---

## ✨ Key Features

### 🔐 **Authentication & Security**
- **Secure JWT-based authentication**
- **Role-based access control** (Admin, Attorney, Paralegal, Staff)
- **Password reset functionality**
- **Session management**

### 📁 **Case Management**
- **Complete case lifecycle tracking**
- **Case assignment and status management**
- **Timeline and activity tracking**
- **Practice area categorization**
- **Conflict checking system**

### 📄 **Document Automation**
- **Template-based document generation**
- **Auto-fill with client/case data**
- **PDF export functionality**
- **Customizable templates**
- **Document version control**

### 📅 **Calendar & Task Management**
- **Integrated calendar system**
- **Court date tracking**
- **Task management with priorities**
- **Deadline reminders**
- **Meeting scheduling**

### 👥 **Client Management**
- **Comprehensive client profiles**
- **Contact information management**
- **Communication history**
- **Client portal support**
- **Document sharing**

### 📊 **Analytics & Reporting**
- **Case performance metrics**
- **Workload distribution**
- **Revenue tracking**
- **Custom reports**
- **Data visualization**

---

## 🛠️ Technology Stack

| **Frontend** | **Backend** | **Database** | **Tools & Libraries** |
|--------------|-------------|--------------|----------------------|
| React 18 | Node.js | MySQL 8.0 | JWT Authentication |
| Material-UI | Express.js | WAMP/XAMPP | bcryptjs |
| React Router | CORS | Sequelize | date-fns |
| React Hot Toast | Helmet | Connection Pool | PDF Generation |
| Bootstrap | dotenv | Transactions | File Upload |

---

## 🖼️ Screenshots

<div align="center">

| **Dashboard** | **Case Management** |
|---------------|-------------------|
| ![Dashboard](./screenshots/dashboard.png) | ![Case Details](./screenshots/cases.png) |

| **Calendar & Tasks** | **Document Templates** |
|---------------------|----------------------|
| ![Calendar](./screenshots/calendar.png) | ![Templates](./screenshots/templates.png) |

| **Client Management** | **Authentication** |
|---------------------|------------------|
| ![Clients](./screenshots/Clients.png) | ![Login](./screenshots/login.png) |

</div>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **WAMP/XAMPP** (for local development)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/robertxulu9/case-management-system.git
   cd case-management-system
   ```

2. **Database Setup**
   ```bash
   # Start your MySQL server (WAMP/XAMPP)
   # Create a database named 'cms'
   ```

3. **Backend Setup**
   ```bash
   cd cms-backend
   npm install
   
   # Create .env file
   echo "DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=cms
   DB_PORT=3306
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   CORS_ORIGIN=http://localhost:3000" > .env
   
   # Run database migrations
   node setup-database.js
   
   # Start backend server
   npm start
   ```

4. **Frontend Setup**
   ```bash
   cd ..
   npm install
   npm start
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

---

## 📖 Documentation

### API Endpoints

| **Endpoint** | **Method** | **Description** |
|--------------|------------|-----------------|
| `/api/auth/signin` | POST | User authentication |
| `/api/auth/signup` | POST | User registration |
| `/api/cases` | GET/POST | Case management |
| `/api/clients` | GET/POST | Client management |
| `/api/calendar` | GET/POST | Calendar events |
| `/api/documents` | GET/POST | Document management |
| `/api/templates` | GET/POST | Document templates |

### Database Schema

The system uses the following main tables:
- `users` - User accounts and authentication
- `clients` - Client information
- `cases` - Case details and status
- `calendar_items` - Events and tasks
- `case_documents` - Document storage
- `case_notes` - Case notes and comments
- `timeline_events` - Case activity timeline

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `cms-backend` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cms
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Customization

- **Templates**: Add custom document templates in the templates section
- **Practice Areas**: Configure practice areas in the database
- **User Roles**: Modify role permissions in the authentication system

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Robert Zulu**
- GitHub: [@robertxulu9](https://github.com/robertxulu9)
- LinkedIn: [Robert Zulu](https://www.linkedin.com/in/robert-zulu/)
- email: [robertxulu9@gmail.com]

---

## 🙏 Acknowledgments

- **Creative Tim** for the Soft UI Dashboard React template
- **Material-UI** for the component library
- **MySQL** for the database system
- **Express.js** for the backend framework

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/robertxulu9/case-management-system?style=social)](https://github.com/robertxulu9/case-management-system/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/robertxulu9/case-management-system?style=social)](https://github.com/robertxulu9/case-management-system/network)
[![GitHub issues](https://img.shields.io/github/issues/robertxulu9/case-management-system)](https://github.com/robertxulu9/case-management-system/issues)

</div>
