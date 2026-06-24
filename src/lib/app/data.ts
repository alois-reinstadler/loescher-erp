export type AppIconName =
	| 'dashboard'
	| 'calendar'
	| 'tasks'
	| 'maps'
	| 'sourcing'
	| 'samples'
	| 'meetings'
	| 'procurement'
	| 'production'
	| 'logistics'
	| 'fulfillment'
	| 'customers'
	| 'invoices'
	| 'orders'
	| 'inventory'
	| 'reports'
	| 'settings'
	| 'help'
	| 'search'
	| 'barcode'
	| 'product-images';

export type AppNavItem = {
	title: string;
	url: string;
	icon: AppIconName;
};

export type AppDocumentItem = {
	name: string;
	url: string;
	icon: AppIconName;
	count: number;
};

export type AppUser = {
	name: string;
	email: string;
	initials: string;
	avatar: string;
};

export type ShellTask = {
	id: string;
	title: string;
	due: string;
	status: 'open' | 'waiting' | 'done';
};

export type AppShellData = {
	brand: string;
	user: AppUser;
	notificationCount: number;
	navMain: AppNavItem[];
	documents: AppDocumentItem[];
	tools: AppNavItem[];
	navSecondary: AppNavItem[];
	tasks: ShellTask[];
};

export type Metric = {
	id: string;
	label: string;
	value: string;
	change: string;
	trend: 'up' | 'down';
	summary: string;
	description: string;
};

export type ChartPoint = {
	date: string;
	revenue: number;
	expenses: number;
};

export type ActivityItem = {
	id: string;
	customer: string;
	document: string;
	status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
	amount: string;
	updated: string;
};

export type DashboardData = {
	metrics: Metric[];
	chart: ChartPoint[];
	activity: ActivityItem[];
};

export type WorkloadItem = {
	id: string;
	title: string;
	owner: string;
	due: string;
	process: string;
	priority: 'Low' | 'Medium' | 'High';
	status: 'Open' | 'Waiting' | 'Blocked' | 'Done';
};

export type CalendarEvent = {
	id: string;
	date: string;
	time: string;
	title: string;
	type: 'Customer' | 'Supplier' | 'Logistics' | 'Internal';
	location: string;
	owner: string;
};

export type ShipmentPin = {
	id: string;
	label: string;
	location: string;
	lane: string;
	status: string;
	eta: string;
	x: number;
	y: number;
};

export type PhotoQuotation = {
	id: string;
	supplier: string;
	country: 'China' | 'India';
	product: string;
	price: string;
	moq: string;
	leadTime: string;
	status: 'Requested' | 'Received' | 'Negotiating' | 'Shortlisted';
};

export type SampleRequest = {
	id: string;
	supplier: string;
	origin: string;
	tracking: string;
	courier: 'UPS' | 'GLS';
	articles: string;
	eta: string;
	status: 'Requested' | 'In transit' | 'Received' | 'Forwarded';
};

export type CustomerSelection = {
	id: string;
	customer: string;
	market: string;
	meeting: string;
	selectedSamples: number;
	confirmation: string;
	offerToOthers: string;
	status: 'Meeting booked' | 'Samples selected' | 'Confirmation sent' | 'Cross-offer';
};

export type ProcurementOrder = {
	id: string;
	supplier: string;
	articles: string;
	targetPrice: string;
	po: string;
	salesConfirmation: string;
	status: 'Negotiating' | 'PO sent' | 'SC received' | 'Signed back';
};

export type ProductionApproval = {
	id: string;
	supplier: string;
	customer: string;
	preProductionSample: string;
	packaging: string;
	artwork: string;
	shippingMarks: string;
	progress: number;
};

export type LogisticsFile = {
	id: string;
	supplier: string;
	container: 'LCL' | 'FCL';
	forwarder: string;
	documents: string;
	blStatus: string;
	customs: string;
	warehouseReceipt: string;
	status: 'Booked' | 'Docs check' | 'Customs ready' | 'Arrived' | 'Received';
};

export type FulfillmentOrder = {
	id: string;
	customer: string;
	branch: string;
	items: string;
	order: string;
	deliveryNote: string;
	invoice: string;
	payment: string;
	status: 'Ordered' | 'Picking' | 'Shipped' | 'Invoiced' | 'Paid';
};

export type OperationsData = {
	tasks: WorkloadItem[];
	calendar: CalendarEvent[];
	shipments: ShipmentPin[];
	photoQuotations: PhotoQuotation[];
	sampleRequests: SampleRequest[];
	customerSelections: CustomerSelection[];
	procurementOrders: ProcurementOrder[];
	productionApprovals: ProductionApproval[];
	logisticsFiles: LogisticsFile[];
	fulfillmentOrders: FulfillmentOrder[];
};

const shellData: AppShellData = {
	brand: 'Loescher ERP',
	user: {
		name: 'Mara Loescher',
		email: 'mara@loescher.example',
		initials: 'ML',
		avatar: ''
	},
	notificationCount: 4,
	navMain: [
		{ title: 'Dashboard', url: '/dashboard', icon: 'dashboard' },
		{ title: 'Calendar', url: '/calendar', icon: 'calendar' },
		{ title: 'Tasks', url: '/tasks', icon: 'tasks' },
		{ title: 'Maps', url: '/maps', icon: 'maps' },
		{ title: 'Sourcing', url: '/sourcing', icon: 'sourcing' },
		{ title: 'Samples', url: '/samples', icon: 'samples' },
		{ title: 'Customer Meetings', url: '/customer-meetings', icon: 'meetings' },
		{ title: 'Procurement', url: '/procurement', icon: 'procurement' },
		{ title: 'Production', url: '/production', icon: 'production' },
		{ title: 'Import Logistics', url: '/logistics', icon: 'logistics' },
		{ title: 'Fulfillment', url: '/fulfillment', icon: 'fulfillment' }
	],
	documents: [
		{ name: 'Photo quotations', url: '/sourcing', icon: 'sourcing', count: 12 },
		{ name: 'Purchase orders', url: '/procurement', icon: 'orders', count: 7 },
		{ name: 'Import files', url: '/logistics', icon: 'logistics', count: 5 }
	],
	tools: [
		{ title: 'Barcode Generator', url: '/barcode', icon: 'barcode' },
		{ title: 'Product Images', url: '/product-images', icon: 'product-images' }
	],
	navSecondary: [
		{ title: 'Settings', url: '/settings', icon: 'settings' },
		{ title: 'Get Help', url: '/help', icon: 'help' },
		{ title: 'Search', url: '/search', icon: 'search' }
	],
	tasks: [
		{ id: 'task-1', title: 'Check UPS sample shipment 1Z8432', due: 'Today', status: 'open' },
		{
			id: 'task-2',
			title: 'Stamp and sign supplier SC-SZ-104',
			due: 'Tomorrow',
			status: 'waiting'
		},
		{ id: 'task-3', title: 'Send customs documents to forwarder', due: 'Friday', status: 'done' }
	]
};

const dashboardData: DashboardData = {
	metrics: [
		{
			id: 'revenue',
			label: 'Revenue',
			value: '€128,420',
			change: '+12.5%',
			trend: 'up',
			summary: 'Trading above plan',
			description: 'Booked revenue across invoices and orders'
		},
		{
			id: 'receivables',
			label: 'Receivables',
			value: '€34,180',
			change: '-8.2%',
			trend: 'down',
			summary: 'Collections improving',
			description: 'Open balance due in the next 30 days'
		},
		{
			id: 'orders',
			label: 'Active orders',
			value: '246',
			change: '+6.1%',
			trend: 'up',
			summary: 'Demand is steady',
			description: 'Confirmed orders currently in fulfillment'
		},
		{
			id: 'margin',
			label: 'Gross margin',
			value: '31.4%',
			change: '+2.4%',
			trend: 'up',
			summary: 'Pricing holds',
			description: 'Trailing 30 day margin after purchase costs'
		}
	],
	chart: [
		{ date: 'Jan', revenue: 86, expenses: 42 },
		{ date: 'Feb', revenue: 94, expenses: 44 },
		{ date: 'Mar', revenue: 102, expenses: 51 },
		{ date: 'Apr', revenue: 98, expenses: 49 },
		{ date: 'May', revenue: 121, expenses: 57 },
		{ date: 'Jun', revenue: 128, expenses: 61 },
		{ date: 'Jul', revenue: 136, expenses: 64 },
		{ date: 'Aug', revenue: 132, expenses: 62 },
		{ date: 'Sep', revenue: 148, expenses: 68 },
		{ date: 'Oct', revenue: 156, expenses: 71 },
		{ date: 'Nov', revenue: 162, expenses: 74 },
		{ date: 'Dec', revenue: 171, expenses: 78 }
	],
	activity: [
		{
			id: 'act-1',
			customer: 'Berg & Co',
			document: 'Invoice INV-2048',
			status: 'Paid',
			amount: '€8,420',
			updated: '12 min ago'
		},
		{
			id: 'act-2',
			customer: 'Nordlicht GmbH',
			document: 'Offer OFF-1182',
			status: 'Sent',
			amount: '€14,900',
			updated: '43 min ago'
		},
		{
			id: 'act-3',
			customer: 'Atelier Kern',
			document: 'Order ORD-7310',
			status: 'Draft',
			amount: '€2,780',
			updated: '2 hours ago'
		},
		{
			id: 'act-4',
			customer: 'Mayer Handel',
			document: 'Invoice INV-2033',
			status: 'Overdue',
			amount: '€5,160',
			updated: 'Yesterday'
		}
	]
};

const operationsData: OperationsData = {
	tasks: [
		{
			id: 'T-2401',
			title: 'Request photoquotation for velvet accent chair',
			owner: 'Mara',
			due: 'Today',
			process: 'Sourcing',
			priority: 'High',
			status: 'Open'
		},
		{
			id: 'T-2402',
			title: 'Track UPS sample parcel from Moradabad',
			owner: 'Elias',
			due: 'Today',
			process: 'Samples',
			priority: 'Medium',
			status: 'Waiting'
		},
		{
			id: 'T-2403',
			title: 'Prepare order confirmation for XXXLutz CH',
			owner: 'Nina',
			due: 'Tomorrow',
			process: 'Customer Meetings',
			priority: 'High',
			status: 'Open'
		},
		{
			id: 'T-2404',
			title: 'Compare supplier invoice with packing list',
			owner: 'Paul',
			due: 'Jun 27',
			process: 'Import Logistics',
			priority: 'High',
			status: 'Blocked'
		},
		{
			id: 'T-2405',
			title: 'Print delivery notes for Möbelix AT branches',
			owner: 'Warehouse',
			due: 'Jun 28',
			process: 'Fulfillment',
			priority: 'Medium',
			status: 'Open'
		}
	],
	calendar: [
		{
			id: 'CAL-01',
			date: 'Jun 24',
			time: '09:30',
			title: 'XXXLutz AT sample selection',
			type: 'Customer',
			location: 'Wels showroom',
			owner: 'Mara'
		},
		{
			id: 'CAL-02',
			date: 'Jun 24',
			time: '14:00',
			title: 'Price negotiation with Ningbo Home',
			type: 'Supplier',
			location: 'Video call',
			owner: 'Elias'
		},
		{
			id: 'CAL-03',
			date: 'Jun 25',
			time: '11:15',
			title: 'Forwarder booking check',
			type: 'Logistics',
			location: 'Hamburg lane',
			owner: 'Paul'
		},
		{
			id: 'CAL-04',
			date: 'Jun 26',
			time: '10:00',
			title: 'Production OK review',
			type: 'Internal',
			location: 'ERP desk',
			owner: 'Nina'
		}
	],
	shipments: [
		{
			id: 'SHIP-01',
			label: 'UPS samples',
			location: 'Shenzhen',
			lane: 'Supplier to Loescher',
			status: 'Export scan',
			eta: 'Jun 25',
			x: 78,
			y: 48
		},
		{
			id: 'SHIP-02',
			label: 'PPS to customer',
			location: 'Wels',
			lane: 'Loescher to XXXLutz AT',
			status: 'GLS pickup booked',
			eta: 'Jun 24',
			x: 46,
			y: 44
		},
		{
			id: 'SHIP-03',
			label: 'FCL container',
			location: 'Hamburg',
			lane: 'Ningbo to Hamburg',
			status: 'Telex release pending',
			eta: 'Jul 03',
			x: 43,
			y: 37
		},
		{
			id: 'SHIP-04',
			label: 'Branch delivery',
			location: 'Prague',
			lane: 'Warehouse to CZ/SK',
			status: 'Picking',
			eta: 'Jun 29',
			x: 51,
			y: 43
		}
	],
	photoQuotations: [
		{
			id: 'PQ-1007',
			supplier: 'Ningbo Home Living',
			country: 'China',
			product: 'Velvet accent chair, forest green',
			price: 'USD 18.40',
			moq: '960 pcs',
			leadTime: '55 days',
			status: 'Negotiating'
		},
		{
			id: 'PQ-1008',
			supplier: 'Moradabad Metalcraft',
			country: 'India',
			product: 'Hammered brass side table',
			price: 'USD 11.90',
			moq: '600 pcs',
			leadTime: '48 days',
			status: 'Received'
		},
		{
			id: 'PQ-1009',
			supplier: 'Guangzhou Decor Co.',
			country: 'China',
			product: 'Ceramic vase set, 3-piece',
			price: 'USD 4.35',
			moq: '2,400 sets',
			leadTime: '40 days',
			status: 'Shortlisted'
		},
		{
			id: 'PQ-1010',
			supplier: 'Jaipur Textiles Ltd.',
			country: 'India',
			product: 'Hand-knotted wool rug 160×230',
			price: 'USD 42.00',
			moq: '120 pcs',
			leadTime: '65 days',
			status: 'Requested'
		},
		{
			id: 'PQ-1011',
			supplier: 'Foshan Timber Works',
			country: 'China',
			product: 'Oak dining table, extendable',
			price: 'USD 67.50',
			moq: '240 pcs',
			leadTime: '70 days',
			status: 'Received'
		},
		{
			id: 'PQ-1012',
			supplier: 'Chennai Ceramics Pvt.',
			country: 'India',
			product: 'Terrazzo plant pot, set of 2',
			price: 'USD 3.20',
			moq: '3,600 sets',
			leadTime: '35 days',
			status: 'Shortlisted'
		},
		{
			id: 'PQ-1013',
			supplier: 'Ningbo Home Living',
			country: 'China',
			product: 'Linen sofa, 3-seater',
			price: 'USD 124.00',
			moq: '120 pcs',
			leadTime: '75 days',
			status: 'Negotiating'
		}
	],
	sampleRequests: [
		{
			id: 'SR-221',
			supplier: 'Ningbo Home Living',
			origin: 'Ningbo, China',
			tracking: '1Z8432E70499812015',
			courier: 'UPS',
			articles: '3 chair colors (forest, navy, terracotta)',
			eta: 'Jun 25',
			status: 'In transit'
		},
		{
			id: 'SR-222',
			supplier: 'Moradabad Metalcraft',
			origin: 'Moradabad, India',
			tracking: '1Z27F44A0494413320',
			courier: 'UPS',
			articles: '2 table finishes (polished, brushed)',
			eta: 'Jun 26',
			status: 'Requested'
		},
		{
			id: 'SR-223',
			supplier: 'Guangzhou Decor Co.',
			origin: 'Guangzhou, China',
			tracking: 'GLS-AT-4419008',
			courier: 'GLS',
			articles: 'Vase set PPS, white & sage',
			eta: 'Jun 24',
			status: 'Forwarded'
		},
		{
			id: 'SR-224',
			supplier: 'Jaipur Textiles Ltd.',
			origin: 'Jaipur, India',
			tracking: '1Z998AA20126638441',
			courier: 'UPS',
			articles: '4 rug samples (natural, indigo, rust, grey)',
			eta: 'Jun 28',
			status: 'In transit'
		},
		{
			id: 'SR-225',
			supplier: 'Foshan Timber Works',
			origin: 'Foshan, China',
			tracking: '1Z662BB30987126784',
			courier: 'UPS',
			articles: 'Oak table sample + 3 stain swatches',
			eta: 'Jun 30',
			status: 'Requested'
		},
		{
			id: 'SR-226',
			supplier: 'Ningbo Home Living',
			origin: 'Ningbo, China',
			tracking: 'GLS-AT-4421550',
			courier: 'GLS',
			articles: 'Sofa PPS, oatmeal linen',
			eta: 'Jul 02',
			status: 'Requested'
		}
	],
	customerSelections: [
		{
			id: 'CS-501',
			customer: 'XXXLutz AT',
			market: 'Austria',
			meeting: 'Jun 24, Wels',
			selectedSamples: 18,
			confirmation: 'AB-AT-882 draft',
			offerToOthers: 'Möbelix AT',
			status: 'Samples selected'
		},
		{
			id: 'CS-502',
			customer: 'XXXLutz CH',
			market: 'Switzerland',
			meeting: 'Jun 28, video',
			selectedSamples: 9,
			confirmation: 'AB-CH-219 pending',
			offerToOthers: 'XXXLutz CZ/SK',
			status: 'Confirmation sent'
		},
		{
			id: 'CS-503',
			customer: 'XXXLutz HU',
			market: 'Hungary',
			meeting: 'Jul 01, Budapest',
			selectedSamples: 0,
			confirmation: 'Not started',
			offerToOthers: 'Open',
			status: 'Meeting booked'
		},
		{
			id: 'CS-504',
			customer: 'Möbelix AT',
			market: 'Austria',
			meeting: 'Jun 24, Wels',
			selectedSamples: 12,
			confirmation: 'AB-MX-104 sent',
			offerToOthers: '—',
			status: 'Confirmation sent'
		},
		{
			id: 'CS-505',
			customer: 'XXXLutz CZ/SK',
			market: 'Czech Rep. / Slovakia',
			meeting: 'Jul 03, Prague',
			selectedSamples: 0,
			confirmation: 'Not started',
			offerToOthers: 'Open',
			status: 'Meeting booked'
		},
		{
			id: 'CS-506',
			customer: 'XXXLutz AT',
			market: 'Austria',
			meeting: 'Jul 08, Graz',
			selectedSamples: 0,
			confirmation: 'Not started',
			offerToOthers: 'Möbelix AT',
			status: 'Meeting booked'
		}
	],
	procurementOrders: [
		{
			id: 'PO-7401',
			supplier: 'Ningbo Home Living',
			articles: 'Velvet accent chair, 1,920 pcs',
			targetPrice: 'USD 17.80',
			po: 'Sent Jun 20',
			salesConfirmation: 'SC received, signature missing',
			status: 'SC received'
		},
		{
			id: 'PO-7402',
			supplier: 'Moradabad Metalcraft',
			articles: 'Brass side table, 900 pcs',
			targetPrice: 'USD 11.30',
			po: 'Draft',
			salesConfirmation: 'Not received',
			status: 'Negotiating'
		},
		{
			id: 'PO-7403',
			supplier: 'Guangzhou Decor Co.',
			articles: 'Ceramic vase set, 3,600 sets',
			targetPrice: 'USD 4.05',
			po: 'Sent Jun 18',
			salesConfirmation: 'Stamped and returned',
			status: 'Signed back'
		},
		{
			id: 'PO-7404',
			supplier: 'Jaipur Textiles Ltd.',
			articles: 'Wool rug 160×230, 360 pcs',
			targetPrice: 'USD 39.00',
			po: 'Draft',
			salesConfirmation: 'Not received',
			status: 'Negotiating'
		},
		{
			id: 'PO-7405',
			supplier: 'Foshan Timber Works',
			articles: 'Oak extendable table, 480 pcs',
			targetPrice: 'USD 63.00',
			po: 'Sent Jun 22',
			salesConfirmation: 'SC received, pending review',
			status: 'SC received'
		},
		{
			id: 'PO-7406',
			supplier: 'Chennai Ceramics Pvt.',
			articles: 'Terrazzo plant pot set, 4,800 sets',
			targetPrice: 'USD 2.95',
			po: 'Sent Jun 19',
			salesConfirmation: 'Stamped and returned',
			status: 'Signed back'
		},
		{
			id: 'PO-7407',
			supplier: 'Ningbo Home Living',
			articles: 'Linen sofa 3-seater, 240 pcs',
			targetPrice: 'USD 118.00',
			po: 'Draft',
			salesConfirmation: 'Not received',
			status: 'Negotiating'
		}
	],
	productionApprovals: [
		{
			id: 'PA-330',
			supplier: 'Ningbo Home Living',
			customer: 'XXXLutz AT',
			preProductionSample: 'UPS to customer',
			packaging: 'Details sent',
			artwork: 'Awaiting supplier revision',
			shippingMarks: 'Approved',
			progress: 68
		},
		{
			id: 'PA-331',
			supplier: 'Moradabad Metalcraft',
			customer: 'XXXLutz CH',
			preProductionSample: 'Requested',
			packaging: 'Open',
			artwork: 'Open',
			shippingMarks: 'Open',
			progress: 24
		},
		{
			id: 'PA-332',
			supplier: 'Guangzhou Decor Co.',
			customer: 'Möbelix AT',
			preProductionSample: 'Confirmed by customer',
			packaging: 'Confirmed',
			artwork: 'Approved',
			shippingMarks: 'Approved',
			progress: 100
		},
		{
			id: 'PA-333',
			supplier: 'Jaipur Textiles Ltd.',
			customer: 'XXXLutz HU',
			preProductionSample: 'In transit to customer',
			packaging: 'Details sent',
			artwork: 'Awaiting customer review',
			shippingMarks: 'Awaiting supplier',
			progress: 52
		},
		{
			id: 'PA-334',
			supplier: 'Foshan Timber Works',
			customer: 'XXXLutz AT',
			preProductionSample: 'Confirmed by customer',
			packaging: 'Confirmed',
			artwork: 'Awaiting supplier revision',
			shippingMarks: 'Awaiting supplier',
			progress: 76
		},
		{
			id: 'PA-335',
			supplier: 'Chennai Ceramics Pvt.',
			customer: 'Möbelix AT',
			preProductionSample: 'Confirmed by customer',
			packaging: 'Confirmed',
			artwork: 'Approved',
			shippingMarks: 'Approved',
			progress: 100
		}
	],
	logisticsFiles: [
		{
			id: 'IMP-901',
			supplier: 'Ningbo Home Living',
			container: 'FCL',
			forwarder: 'Kuehne + Nagel',
			documents: 'Invoice + packing list received',
			blStatus: 'Draft B/L under review',
			customs: 'HS codes missing for cushions',
			warehouseReceipt: 'Pending',
			status: 'Docs check'
		},
		{
			id: 'IMP-902',
			supplier: 'Moradabad Metalcraft',
			container: 'LCL',
			forwarder: 'Gebrüder Weiss',
			documents: 'Commercial docs sent',
			blStatus: 'Telex release forwarded',
			customs: 'Ready',
			warehouseReceipt: 'Pending arrival',
			status: 'Customs ready'
		},
		{
			id: 'IMP-903',
			supplier: 'Guangzhou Decor Co.',
			container: 'FCL',
			forwarder: 'Dachser',
			documents: 'Matched to PO',
			blStatus: 'Original B/L filed',
			customs: 'Cleared',
			warehouseReceipt: 'WE-447 written',
			status: 'Received'
		},
		{
			id: 'IMP-904',
			supplier: 'Jaipur Textiles Ltd.',
			container: 'LCL',
			forwarder: 'Kuehne + Nagel',
			documents: 'Pending supplier invoice',
			blStatus: 'Not yet issued',
			customs: 'Pending',
			warehouseReceipt: 'Pending',
			status: 'Booked'
		},
		{
			id: 'IMP-905',
			supplier: 'Foshan Timber Works',
			container: 'FCL',
			forwarder: 'Dachser',
			documents: 'Invoice + packing list received',
			blStatus: 'Draft B/L under review',
			customs: 'HS codes confirmed',
			warehouseReceipt: 'Pending',
			status: 'Docs check'
		},
		{
			id: 'IMP-906',
			supplier: 'Chennai Ceramics Pvt.',
			container: 'LCL',
			forwarder: 'Gebrüder Weiss',
			documents: 'Matched to PO',
			blStatus: 'Original B/L filed',
			customs: 'Cleared',
			warehouseReceipt: 'WE-451 written',
			status: 'Received'
		}
	],
	fulfillmentOrders: [
		{
			id: 'SO-12001',
			customer: 'XXXLutz AT',
			branch: 'Wels',
			items: '144 velvet chairs',
			order: 'Auftrag created',
			deliveryNote: 'LS-8891 printed',
			invoice: 'Draft invoice',
			payment: '30 days net',
			status: 'Shipped'
		},
		{
			id: 'SO-12002',
			customer: 'Möbelix AT',
			branch: 'Linz',
			items: '72 vase sets',
			order: 'Auftrag created',
			deliveryNote: 'Open',
			invoice: 'Open',
			payment: 'After delivery',
			status: 'Picking'
		},
		{
			id: 'SO-12003',
			customer: 'XXXLutz CZ/SK',
			branch: 'Prague',
			items: '96 brass tables',
			order: 'Branch order imported',
			deliveryNote: 'LS-8895 printed',
			invoice: 'AR-5530 sent',
			payment: 'Open',
			status: 'Invoiced'
		},
		{
			id: 'SO-12004',
			customer: 'XXXLutz AT',
			branch: 'Graz',
			items: '48 extendable tables',
			order: 'Auftrag created',
			deliveryNote: 'LS-8902 printed',
			invoice: 'AR-5538 sent',
			payment: '30 days net',
			status: 'Invoiced'
		},
		{
			id: 'SO-12005',
			customer: 'XXXLutz HU',
			branch: 'Budapest',
			items: '240 wool rugs',
			order: 'Branch order imported',
			deliveryNote: 'Open',
			invoice: 'Open',
			payment: '60 days net',
			status: 'Ordered'
		},
		{
			id: 'SO-12006',
			customer: 'Möbelix AT',
			branch: 'Vienna',
			items: '1,200 plant pot sets',
			order: 'Auftrag created',
			deliveryNote: 'LS-8910 printed',
			invoice: 'Draft invoice',
			payment: 'After delivery',
			status: 'Shipped'
		},
		{
			id: 'SO-12007',
			customer: 'XXXLutz CZ/SK',
			branch: 'Bratislava',
			items: '36 velvet chairs',
			order: 'Branch order imported',
			deliveryNote: 'Open',
			invoice: 'Open',
			payment: '30 days net',
			status: 'Ordered'
		},
		{
			id: 'SO-12008',
			customer: 'XXXLutz AT',
			branch: 'Salzburg',
			items: '24 linen sofas',
			order: 'Auftrag created',
			deliveryNote: 'LS-8915 printed',
			invoice: 'AR-5542 sent',
			payment: '30 days net',
			status: 'Invoiced'
		}
	]
};

function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getAppShellData() {
	await wait(180);
	return shellData;
}

export async function getDashboardData() {
	await wait(260);
	return dashboardData;
}

export async function getOperationsData() {
	await wait(220);
	return operationsData;
}
