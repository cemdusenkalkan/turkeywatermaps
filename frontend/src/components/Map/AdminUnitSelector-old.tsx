import { useLanguage } from '../../contexts/LanguageContext';

type AdminUnit = 'province' | 'basin-l6' | 'basin-l7' | 'basin-detailed';

interface AdminUnitSelectorProps {
  value: AdminUnit;
  onChange: (unit: AdminUnit) => void;
  className?: string;
}

export function AdminUnitSelector({ value, onChange, className = '' }: AdminUnitSelectorProps) {
  const { t } = useLanguage();

  const options: { value: AdminUnit; label: string; description: string }[] = [
    {
      value: 'province',
      label: t('map.adminUnit.province') || 'Provinces',
      description: t('map.adminUnit.provinceDesc') || 'Administrative boundaries (81 provinces)'
    },
    {
      value: 'basin-l6',
      label: t('map.adminUnit.basin') || 'Basins (Large)',
      description: t('map.adminUnit.basinDesc') || 'Hydrological basins - natural water units (~138 basins)'
    },
    {
      value: 'basin-l7',
      label: t('map.adminUnit.subbasin') || 'Sub-basins (Medium)',
      description: t('map.adminUnit.subbasinDesc') || 'Detailed sub-basin network'
    },
    {
      value: 'basin-detailed',
      label: t('map.adminUnit.microbasin') || 'Micro-basins (Detailed)',
      description: t('map.adminUnit.microbasinDesc') || 'Highest resolution basin network (~981 basins)'
    }
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 ${className}`}>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
        {t('map.adminUnit.title') || 'Aggregation Unit'}
      </label>
      
      <div className="space-y-2">
        {options.map((option) => (
          <div
            key={option.value}
            className={`
              relative rounded-md border-2 p-3 cursor-pointer transition-all
              ${value === option.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
              }
            `}
            onClick={() => onChange(option.value)}
          >
            <div className="flex items-start">
              <input
                type="radio"
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className="mt-1 mr-3"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {option.label}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {option.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
        <p className="text-xs text-blue-800 dark:text-blue-300">
          💡 {t('map.adminUnit.hint') || 'Basins show natural water flow boundaries, while provinces show political boundaries.'}
        </p>
      </div>
    </div>
  );
}
