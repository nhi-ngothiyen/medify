# Medify Admin 🏥

Admin dashboard cho hệ thống quản lý y tế Medify.

## 🚀 Công nghệ

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router** - Routing
- **CSS3** - Styling với CSS variables

## 📦 Cài đặt

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Cấu trúc dự án

```
src/
├── assets/         # Images, fonts, static files
├── components/     # Reusable UI components
├── constants/      # App constants & config
├── hooks/          # Custom React hooks
├── pages/          # Page components (routes)
├── services/       # API services & integrations
├── styles/         # Global styles & variables
├── types/          # TypeScript type definitions
├── utils/          # Helper functions
└── App.tsx         # Root component
```

📖 Xem chi tiết tại [STRUCTURE.md](./STRUCTURE.md)

## 🔑 Môi trường

Tạo file `.env` với các biến sau:

```env
VITE_API=http://localhost:8000
```

## 🎨 Features

- ✅ Authentication với JWT
- ✅ User management
- ✅ Protected routes
- ✅ Modern UI design
- ✅ TypeScript type safety
- ✅ Responsive design
- ✅ Clean architecture

## 📝 Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🔐 Authentication

Login credentials mặc định:
- Email: `admin@medify.vn`
- Password: `Admin@123`

## 📱 Pages

- `/login` - Login page
- `/` - Users management (protected)

## 🛠️ Development

### Adding new page

1. Tạo component trong `src/pages/`
2. Thêm route trong `src/App.tsx`
3. Thêm constants vào `src/constants/index.ts`

### Adding new API endpoint

1. Thêm service function vào `src/services/apiService.ts`
2. Import và sử dụng trong component

### Adding new type

1. Thêm interface/type vào `src/types/index.ts`
2. Export và sử dụng trong toàn bộ app

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/)

## 👥 Team

Developed by Medify Team

## 📄 License

Private - All rights reserved
