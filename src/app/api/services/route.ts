import { NextRequest, NextResponse } from "next/server";
import { getAllServices, getActiveServices, addService, type Service } from "@/lib/services-store";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const activeOnly = searchParams.get("active") === "true";

  const services = activeOnly ? getActiveServices() : getAllServices();
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  const body = await request.json();

  const newService: Service = {
    id: `service-${Date.now()}`,
    name: body.name,
    description: body.description || "",
    price: body.price,
    duration: body.duration,
    isActive: true,
    sortOrder: getAllServices().length + 1,
  };

  addService(newService);
  return NextResponse.json(newService, { status: 201 });
}
