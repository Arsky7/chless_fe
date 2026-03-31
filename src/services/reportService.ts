import { apiService } from './api';

export interface SalesReportSummary {
    total_orders: number;
    total_sales: number;
    total_sales_formatted: string;
    average_order: number;
    average_order_formatted: string;
    total_items: number;
}

export interface SalesDataPoint {
    period: string;
    period_label: string;
    total_orders: number;
    total_sales: number;
    average_order_value: number;
}

export interface SalesReportResponse {
    data: {
        period: 'daily' | 'weekly' | 'monthly' | 'yearly';
        from_date: string;
        to_date: string;
        summary: SalesReportSummary;
        sales_data: SalesDataPoint[];
    };
}

export interface ProductReportItem {
    id: number;
    name: string;
    sku: string;
    category: string;
    sold_quantity: number;
    total_revenue: number;
    total_revenue_formatted: string;
    current_stock: number;
}

export interface ProductReportResponse {
    data: {
        products: ProductReportItem[];
        meta: {
            current_page: number;
            last_page: number;
            total: number;
            per_page: number;
            from_date: string;
            to_date: string;
        };
    };
}

export interface ReportParams {
    period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    from_date?: string;
    to_date?: string;
    category_id?: number | string;
    page?: number;
    per_page?: number;
}

export const reportService = {
    getSalesReport: async (params?: ReportParams): Promise<SalesReportResponse> => {
        return await apiService.get<SalesReportResponse>('/admin/reports/sales', params);
    },

    getProductReport: async (params?: ReportParams): Promise<ProductReportResponse> => {
        return await apiService.get<ProductReportResponse>('/admin/reports/products', params);
    },
};
