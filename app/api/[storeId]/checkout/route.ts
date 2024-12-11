import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { productsIds } = await req.json();

    if (!productsIds || productsIds.length === 0) {
      return new NextResponse("Se requiere el ID de al menos un producto", {
        status: 400,
      });
    }

    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: productsIds,
        },
      },
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    products.forEach((product) => {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: "CLP",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price.toNumber(),
        },
      });
    });

    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        orderItems: {
          create: productsIds.map((productosId: string) => ({
            productos: {
              connect: {
                id: productosId,
              },
            },
          })),
        },
      },
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json(
      { url: session.url },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Error durante el checkout:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
