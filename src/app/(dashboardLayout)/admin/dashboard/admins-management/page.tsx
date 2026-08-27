import AdminsFilter from "@/components/modules/Admin/AdminsManagement/AdminsFilter";
import AdminsManagementHeader from "@/components/modules/Admin/AdminsManagement/AdminsManagementHeader";
import AdminsTable from "@/components/modules/Admin/AdminsManagement/AdminsTable";
import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import { getAdmins } from "@/services/admin/adminsManagement";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { ShieldCheck, UserRoundCheck, UsersRound } from "lucide-react";
import { Suspense } from "react";

const AdminAdminsManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);
  const adminsResult = await getAdmins(queryString);
  const currentUser = await getUserInfo();

  const totalPages = Math.ceil(
    (adminsResult?.meta?.total || 1) / (adminsResult?.meta?.limit || 1),
  );
  const totalAdmins = adminsResult?.meta?.total || 0;
  const visibleAdmins = adminsResult?.data?.length || 0;
  const activeAdmins =
    adminsResult?.data?.filter(
      (admin: { isDeleted?: boolean }) => !admin.isDeleted,
    ).length || 0;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border bg-teal-50/30 p-5 shadow-sm sm:p-7">
        <AdminsManagementHeader />
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border bg-background/70 p-4">
            <UsersRound className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Total admins
              </p>
              <p className="text-xl font-semibold">{totalAdmins}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border bg-background/70 p-4">
            <UserRoundCheck className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Active on page
              </p>
              <p className="text-xl font-semibold">{activeAdmins}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border bg-background/70 p-4">
            <ShieldCheck className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Showing now
              </p>
              <p className="text-xl font-semibold">{visibleAdmins}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Administrator directory
          </h2>
          <p className="text-sm text-muted-foreground">
            Review accounts, permissions, and contact details.
          </p>
        </div>
        <AdminsFilter />

        <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
          <AdminsTable
            admins={adminsResult?.data || []}
            currentUserEmail={currentUser?.email}
            currentUserRole={currentUser?.role}
          />
          <TablePagination
            currentPage={adminsResult?.meta?.page || 1}
            totalPages={totalPages || 1}
          />
        </Suspense>
      </section>
    </div>
  );
};

export default AdminAdminsManagementPage;
