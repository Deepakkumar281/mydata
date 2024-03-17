export interface ListResponse<T> {
    primary_key: String
    total_results: Number
    page: Number 
    results_per_page: Number | null
    results: T[]
}