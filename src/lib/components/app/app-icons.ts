import ChartBarIcon from '@tabler/icons-svelte/icons/chart-bar';
import CalendarIcon from '@tabler/icons-svelte/icons/calendar';
import ChecklistIcon from '@tabler/icons-svelte/icons/checklist';
import ClipboardListIcon from '@tabler/icons-svelte/icons/clipboard-list';
import DashboardIcon from '@tabler/icons-svelte/icons/dashboard';
import DatabaseIcon from '@tabler/icons-svelte/icons/database';
import FileDescriptionIcon from '@tabler/icons-svelte/icons/file-description';
import FileInvoiceIcon from '@tabler/icons-svelte/icons/file-invoice';
import HelpIcon from '@tabler/icons-svelte/icons/help';
import ListDetailsIcon from '@tabler/icons-svelte/icons/list-details';
import MapIcon from '@tabler/icons-svelte/icons/map-2';
import PackageIcon from '@tabler/icons-svelte/icons/package';
import PhotoIcon from '@tabler/icons-svelte/icons/photo';
import ReportIcon from '@tabler/icons-svelte/icons/report';
import SearchIcon from '@tabler/icons-svelte/icons/search';
import SettingsIcon from '@tabler/icons-svelte/icons/settings';
import ShipIcon from '@tabler/icons-svelte/icons/ship';
import ShoppingCartIcon from '@tabler/icons-svelte/icons/shopping-cart';
import TruckIcon from '@tabler/icons-svelte/icons/truck';
import UsersGroupIcon from '@tabler/icons-svelte/icons/users-group';
import UsersIcon from '@tabler/icons-svelte/icons/users';
import BarcodeIcon from '@tabler/icons-svelte/icons/barcode';
import PhotoAiIcon from '@tabler/icons-svelte/icons/photo-ai';
import type { AppIconName } from '$lib/app/data.js';

export const appIcons = {
	dashboard: DashboardIcon,
	calendar: CalendarIcon,
	tasks: ChecklistIcon,
	maps: MapIcon,
	sourcing: PhotoIcon,
	samples: PackageIcon,
	meetings: UsersGroupIcon,
	procurement: ClipboardListIcon,
	production: TruckIcon,
	logistics: ShipIcon,
	fulfillment: ShoppingCartIcon,
	customers: UsersIcon,
	invoices: FileDescriptionIcon,
	orders: ListDetailsIcon,
	inventory: DatabaseIcon,
	reports: ReportIcon,
	settings: SettingsIcon,
	help: HelpIcon,
	search: SearchIcon,
	barcode: BarcodeIcon,
	'product-images': PhotoAiIcon
} satisfies Record<AppIconName, typeof DashboardIcon>;

export type AppIconComponent = typeof DashboardIcon;
export const dashboardIcon = DashboardIcon;
export const analyticsIcon = ChartBarIcon;
export const invoiceIcon = FileInvoiceIcon;

export function getAppIcon(name: AppIconName) {
	return appIcons[name];
}
