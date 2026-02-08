// src/app.d.ts

declare global {
	namespace App {
		interface Locals {
			user?: {
				id: number;
				email: string;
				roles: string[]; // <--- Change 'role' to 'roles' here
			} | null;
		}
		interface PageData {
			user?: {
				id: number;
				email: string;
				roles: string[]; // <--- Change 'role' to 'roles' here
			} | null;
		}
		// ... other interfaces
	}
}

export {};