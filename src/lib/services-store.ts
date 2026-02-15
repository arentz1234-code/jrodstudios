// In-memory services store (for demo purposes)

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
  sortOrder: number;
}

// Initialize with default services
const defaultServices: Service[] = [
  { id: "regular-cut", name: "Regular Cut", description: "Classic precision cut tailored to your style", price: 30, duration: 30, isActive: true, sortOrder: 1 },
  { id: "skin-fade", name: "Skin Fade", description: "Sharp, clean fade down to the skin", price: 30, duration: 45, isActive: true, sortOrder: 2 },
  { id: "beard-service", name: "Beard Service", description: "Professional trim, shape, and conditioning", price: 20, duration: 30, isActive: true, sortOrder: 3 },
  { id: "haircut-beard", name: "Haircut & Beard", description: "Complete grooming experience", price: 45, duration: 50, isActive: true, sortOrder: 4 },
  { id: "hot-towel-shave", name: "Hot Towel Shave", description: "Luxurious traditional straight razor shave", price: 65, duration: 55, isActive: true, sortOrder: 5 },
  { id: "line-up", name: "Line Up", description: "Clean edges and sharp lines", price: 10, duration: 15, isActive: true, sortOrder: 6 },
  { id: "facial-hair", name: "Facial Hair", description: "Mustache & goatee trim", price: 5, duration: 15, isActive: true, sortOrder: 7 },
  { id: "eyebrows", name: "Eyebrows", description: "Eyebrow cleanup and shaping", price: 5, duration: 5, isActive: true, sortOrder: 8 },
];

// Global store
const services: Map<string, Service> = new Map(
  defaultServices.map((s) => [s.id, s])
);

export function getAllServices(): Service[] {
  return Array.from(services.values()).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getActiveServices(): Service[] {
  return getAllServices().filter((s) => s.isActive);
}

export function getServiceById(id: string): Service | undefined {
  return services.get(id);
}

export function updateService(id: string, updates: Partial<Service>): Service | null {
  const existing = services.get(id);
  if (!existing) return null;

  const updated = { ...existing, ...updates };
  services.set(id, updated);
  return updated;
}

export function addService(service: Service): Service {
  services.set(service.id, service);
  return service;
}

export function deleteService(id: string): boolean {
  return services.delete(id);
}
