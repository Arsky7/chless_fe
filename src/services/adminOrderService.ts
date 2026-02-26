import { apiService } from './api'
import {
    FilterParams,
    OrdersResponse,
    OrderStatsResponse,
    OrderDetailResponse
} from '../pages/admin/order/types/order.types'

const adminOrderService = {
    /**
     * Fetch paginated orders with filters
     */
    getOrders: async (params: FilterParams): Promise<OrdersResponse> => {
        return apiService.get<OrdersResponse>('/admin/orders', params)
    },

    /**
     * Fetch order statistics and today summary
     */
    getOrderStats: async (): Promise<OrderStatsResponse> => {
        return apiService.get<OrderStatsResponse>('/admin/orders/stats')
    },

    /**
     * Fetch single order detail
     */
    getOrder: async (id: number | string): Promise<OrderDetailResponse> => {
        return apiService.get<OrderDetailResponse>(`/admin/orders/${id}`)
    },

    /**
     * Update order status
     */
    updateStatus: async (id: number | string, data: { status: string; tracking_number?: string; notes?: string }): Promise<OrderDetailResponse> => {
        return apiService.patch<OrderDetailResponse>(`/admin/orders/${id}/status`, data)
    },

    /**
     * Delete a cancelled order
     */
    deleteOrder: async (id: number | string): Promise<{ success: boolean; message: string }> => {
        return apiService.delete<{ success: boolean; message: string }>(`/admin/orders/${id}`)
    }
}

export default adminOrderService
