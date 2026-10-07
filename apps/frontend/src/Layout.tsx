import Header from './components/Header';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-black w-full h-screen center flex flex-col">
      <Header />
      <main className="main">{children}</main>
    </div>
  );
};

export default Layout;