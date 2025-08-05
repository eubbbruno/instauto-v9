// Layout simplificado - removido ProtectedRoute e sidebars complexas

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}