// src/app.d.ts

declare global {
	namespace App {
		interface Locals {
			user?: {
				id: number | null;
				email: string;
				roles: string[]; // <--- Change 'role' to 'roles' here
				isAdmin: boolean;
				createdAt?: Date | null;

			} | null;
		}
		interface PageData {
			user?: {
				id: number;
				email: string;
				roles: string[]; // <--- Change 'role' to 'roles' here
				createdAt?: Date | null;
			} | null;
		}
		// ... other interfaces
	}
}

export {};