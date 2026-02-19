const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-700 rounded ${className}`} />
);

const TableSkeleton = () => (
  <div className="bg-gray-800 shadow-lg rounded-lg overflow-x-scroll max-w-7xl mx-auto">
    <table className="min-w-full divide-y divide-gray-700">
      <thead className="bg-gray-700">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Ordered Products
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Email
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Total Amount
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Placed At
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Return
          </th>
        </tr>
      </thead>
      <tbody className="bg-gray-800 divide-y divide-gray-700">
        {[1, 2, 3, 4, 5].map((i) => (
          <tr key={i} className="hover:bg-gray-700">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Skeleton className="h-4 w-24" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Skeleton className="h-4 w-32" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Skeleton className="h-4 w-16" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Skeleton className="h-4 w-20" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="flex justify-center items-center gap-2 py-4 bg-gray-800">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
);

export default TableSkeleton;