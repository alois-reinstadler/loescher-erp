import type { Customer } from '$lib/components/pdf/types.js';

export type CustomerEntry = {
	id: string;
	label: string;
	customer: Customer;
	number: string;
};

const mahler: CustomerEntry = {
	id: 'mahler',
	label: 'Mahler GmbH (Wien)',
	number: 'K-04183',
	customer: {
		name: 'Mahler GmbH',
		address: 'Donaustadtstraße 8\n1220 Wien\nÖsterreich',
		uid: 'ATU 78 123 456',
		number: 'K-04183',
		salutation: 'Frau Mahler'
	}
};

const huber: CustomerEntry = {
	id: 'huber',
	label: 'Huber Logistik AG (Linz)',
	number: 'K-07210',
	customer: {
		name: 'Huber Logistik AG',
		address: 'Industriezeile 211\n4030 Linz\nÖsterreich',
		uid: 'ATU 65 990 117',
		number: 'K-07210',
		salutation: 'Herr Huber'
	}
};

const lindemann: CustomerEntry = {
	id: 'lindemann',
	label: 'Lindemann Möbelwerkstatt (Hamburg)',
	number: 'K-09022',
	customer: {
		name: 'Lindemann Möbelwerkstatt e.K.',
		address: 'Süderstraße 318\n20537 Hamburg\nDeutschland',
		uid: 'DE 217 884 003',
		number: 'K-09022',
		salutation: 'Frau Lindemann'
	}
};

export const customers: Record<string, CustomerEntry> = {
	mahler,
	huber,
	lindemann
};

export const defaultCustomerId = 'mahler';

export function getCustomer(id: string | null | undefined): CustomerEntry {
	if (id && customers[id]) return customers[id];
	return customers[defaultCustomerId];
}

export const customerList: CustomerEntry[] = Object.values(customers);
