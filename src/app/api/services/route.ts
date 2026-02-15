import { NextResponse } from "next/server";

// Hardcoded services for Vercel deployment (no database needed)
const services = [
  { id: "regular-cut", name: "Regular Cut", description: "Classic precision cut tailored to your style", price: 30, duration: 30, isActive: true, sortOrder: 1 },
  { id: "skin-fade", name: "Skin Fade", description: "Sharp, clean fade down to the skin", price: 30, duration: 45, isActive: true, sortOrder: 2 },
  { id: "beard-service", name: "Beard Service", description: "Professional trim, shape, and conditioning", price: 20, duration: 30, isActive: true, sortOrder: 3 },
  { id: "haircut-beard", name: "Haircut & Beard", description: "Complete grooming experience", price: 45, duration: 50, isActive: true, sortOrder: 4 },
  { id: "hot-towel-shave", name: "Hot Towel Shave", description: "Luxurious traditional straight razor shave", price: 65, duration: 55, isActive: true, sortOrder: 5 },
  { id: "line-up", name: "Line Up", description: "Clean edges and sharp lines", price: 10, duration: 15, isActive: true, sortOrder: 6 },
  { id: "facial-hair", name: "Facial Hair", description: "Mustache & goatee trim", price: 5, duration: 15, isActive: true, sortOrder: 7 },
  { id: "eyebrows", name: "Eyebrows", description: "Eyebrow cleanup and shaping", price: 5, duration: 5, isActive: true, sortOrder: 8 },
];

export async function GET() {
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  // For demo purposes - in production, this would save to database
  const body = await request.json();
  return NextResponse.json({ ...body, id: `service-${Date.now()}` }, { status: 201 });
}
