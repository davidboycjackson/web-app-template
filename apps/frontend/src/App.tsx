import { Routes, Route } from "react-router";
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import Layout from "./Layout";
import HomePage from './pages/home/HomePage';
import CreateProjectPage from './pages/create_project/CreateProjectPage';
import AccountPage from './pages/account/AccountPage';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/create-project" element={<CreateProjectPage />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
};

export default App;