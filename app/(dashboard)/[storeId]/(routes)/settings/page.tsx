import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

import { SettingsForms } from "./components/settings-form";

interface SeetingsPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage: React.FC<SeetingsPageProps> = async ({ params }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForms initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
