import { Routes, Route } from "react-router";
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import Layout from "./Layout";
import HomePage from './pages/home/HomePage';
import PageOne from './pages/page1/PageOne';
import PageTwo from './pages/page2/PageTwo';
import PageThree from './pages/page3/PageThree';
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
          <Route path="/page-one" element={<PageOne />} />
          <Route path="/page-two" element={<PageTwo />} />
          <Route path="/page-three" element={<PageThree />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
};

export default App;