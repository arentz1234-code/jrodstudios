import { NextRequest, NextResponse } from "next/server";

const services: Record<string, { id: string; name: string; description: string; price: number; duration: number }> = {
  "regular-cut": { id: "regular-cut", name: "Regular Cut", description: "Classic precision cut tailored to your style", price: 30, duration: 30 },
  "skin-fade": { id: "skin-fade", name: "Skin Fade", description: "Sharp, clean fade down to the skin", price: 30, duration: 45 },
  "beard-service": { id: "beard-service", name: "Beard Service", description: "Professional trim, shape, and conditioning", price: 20, duration: 30 },
  "haircut-beard": { id: "haircut-beard", name: "Haircut & Beard", description: "Complete grooming experience", price: 45, duration: 50 },
  "hot-towel-shave": { id: "hot-towel-shave", name: "Hot Towel Shave", description: "Luxurious traditional straight razor shave", price: 65, duration: 55 },
  "line-up": { id: "line-up", name: "Line Up", description: "Clean edges and sharp lines", price: 10, duration: 15 },
  "facial-hair": { id: "facial-hair", name: "Facial Hair", description: "Mustache & goatee trim", price: 5, duration: 15 },
  "eyebrows": { id: "eyebrows", name: "Eyebrows", description: "Eyebrow cleanup and shaping", price: 5, duration: 5 },
};

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: Context) {
  const { id } = await context.params;
  const service = services[id];

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  return NextResponse.json(service);
}

export async function PUT(request: NextRequest, context: Context) {
  const { id } = await context.params;
  const body = await request.json();
  return NextResponse.json({ id, ...body });
}

export async function DELETE(request: NextRequest, context: Context) {
  const { id } = await context.params;
  return NextResponse.json({ message: `Service ${id} deleted` });
}
