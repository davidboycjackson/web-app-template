import Header from './components/Header';
import Footer from './components/Footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-black w-full min-h-screen center flex-col">
      <Header />
      <main className="flex min-h-screen bg-blue-100">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
