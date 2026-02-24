import { Plus, Upload, Download, Barcode } from 'lucide-react'

interface QuickActionsProps {
  onAddNew: () => void
  onBulkImport: () => void
  onExport: () => void
  onPrintBarcodes: () => void
}

const QuickActions = ({ onAddNew, onBulkImport, onExport, onPrintBarcodes }: QuickActionsProps) => {
  const actions = [
    {
      id: 'add',
      title: 'Add New Product',
      icon: <Plus className="w-5 h-5" />,
      onClick: onAddNew,
      color: 'hover:bg-black',
    },
    {
      id: 'import',
      title: 'Bulk Import',
      icon: <Upload className="w-5 h-5" />,
      onClick: onBulkImport,
      color: 'hover:bg-black',
    },
    {
      id: 'export',
      title: 'Export Catalog',
      icon: <Download className="w-5 h-5" />,
      onClick: onExport,
      color: 'hover:bg-black',
    },
    {
      id: 'barcode',
      title: 'Print Barcodes',
      icon: <Barcode className="w-5 h-5" />,
      onClick: onPrintBarcodes,
      color: 'hover:bg-black',
    },
  ]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
      <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
      <p className="text-sm text-gray-500 mb-6">Common product management tasks</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="group p-6 bg-gray-50 rounded-lg hover:bg-black transition-all duration-300"
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 
                          group-hover:bg-red-500 group-hover:text-white transition-all">
              {action.icon}
            </div>
            <div className="text-sm font-medium text-gray-900 group-hover:text-white transition-colors">
              {action.title}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions