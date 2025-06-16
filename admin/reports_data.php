<?php

if (!defined('REPORTS_DATA_INCLUDED')) {
    define('REPORTS_DATA_INCLUDED', true);

    if (!function_exists('get_demo_report_data')) {
        function get_demo_report_data() {
            return [
                [
                    'transaction_id' => 'TRN001',
                    'property_id' => 'P001',
                    'promotion_type' => 'Boosted Visibility',
                    'date' => '2025-06-01',
                    'user_id' => 'U001',
                    'amount' => 25.00
                ],
                [
                    'transaction_id' => 'TRN002',
                    'property_id' => 'P003',
                    'promotion_type' => 'Boosted Visibility',
                    'date' => '2025-06-03',
                    'user_id' => 'U002',
                    'amount' => 15.00
                ],
                [
                    'transaction_id' => 'TRN003',
                    'property_id' => 'P007',
                    'promotion_type' => 'Boosted Visibility',
                    'date' => '2025-06-05',
                    'user_id' => 'U001',
                    'amount' => 15.00
                ],
                [
                    'transaction_id' => 'TRN004',
                    'property_id' => 'P012',
                    'promotion_type' => 'Boosted Visibility',
                    'date' => '2025-06-06',
                    'user_id' => 'U004',
                    'amount' => 20.00
                ],
            ];
        }
    }

    if (!function_exists('calculate_report_summary')) {
        function calculate_report_summary($report_data) {
            $total_revenue = 0;
            $promotions_sold = count($report_data);
            foreach ($report_data as $item) {
                $total_revenue += $item['amount'];
            }
            $avg_revenue_promo = $promotions_sold > 0 ? $total_revenue / $promotions_sold : 0;
            return [
                'total_revenue' => number_format($total_revenue, 2),
                'promotions_sold' => $promotions_sold,
                'avg_revenue_promo' => number_format($avg_revenue_promo, 2)
            ];
        }
    }

} // End of REPORTS_DATA_INCLUDED define check

?>
