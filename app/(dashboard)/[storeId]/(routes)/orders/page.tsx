import prismadb from "@/lib/prismadb";
import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";

import { format } from "date-fns";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({
  params,
}: {
  params: {
    storeId: string;
  };
}) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          productos: true,
        },
      },
    },
    orderBy: {
      createAt: "desc",
    },
  });

  const formatedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    productos: item.orderItems
      .map((orderItem) => orderItem.productos.name)
      .join(", "),
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        return total + Number(item.productos.price);
      }, 0)
    ),
    isPaid: item.isPaid,
    createdAt: format(new Date(item.createAt), "dd/MM/yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formatedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
