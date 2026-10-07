import { Routes, Route } from "react-router";
import { AuthProvider } from './context/AuthContext';
import Layout from "./Layout";

{/* Page Imports */}
import HomePage from './pages/home/HomePage';
import CreateProjectPage from './pages/create_project/CreateProjectPage';
import ProjectPage from './pages/project/ProjectPage';
import TaskPage from './pages/task/TaskPage';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import AccountPage from './pages/account/AccountPage';

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
          <Route path="/projects/:projectId" element={<ProjectPage />} />
          <Route path="/tasks/:taskId" element={<TaskPage />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
};

export default App;