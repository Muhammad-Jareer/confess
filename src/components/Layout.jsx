
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container max-w-6xl mx-auto px-4 py-6 flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
