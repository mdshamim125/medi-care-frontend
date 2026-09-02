import PublicFooter from "@/components/shared/PublicFooter";
import PublicNavbar from "@/components/shared/PublicNavbar";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto">
      <PublicNavbar />

      <main>{children}</main>

      <PublicFooter />
    </div>
  );
};

export default CommonLayout;

