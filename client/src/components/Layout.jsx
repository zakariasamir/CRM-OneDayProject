const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-muted">
      <header className="p-4 shadow bg-white border-b">
        <h1 className="text-xl font-semibold">CRM System</h1>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
};

export default Layout;
