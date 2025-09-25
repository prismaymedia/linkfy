import { useLocation } from 'wouter';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ROUTE_CONFIG, ROUTES } from '@/lib/routes';
import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';

export default function BreadcrumbNav() {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();

  // Don't show breadcrumbs on auth page or home page
  if (location === ROUTES.AUTH || location === ROUTES.HOME) {
    return null;
  }

  const currentRoute = ROUTE_CONFIG[location as keyof typeof ROUTE_CONFIG];
  
  if (!currentRoute) {
    return null;
  }

  const breadcrumbs = [
    {
      label: t('breadcrumb.dashboard', 'Dashboard'),
      path: ROUTES.DASHBOARD,
      icon: Home,
    },
  ];

  // Add current page if it's not dashboard
  if (location !== ROUTES.DASHBOARD) {
    breadcrumbs.push({
      label: t(`breadcrumb.${currentRoute.title.toLowerCase()}`, currentRoute.title),
      path: location,
      icon: null,
    });
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage className="flex items-center">
                      {crumb.icon && <crumb.icon className="h-4 w-4 mr-1" />}
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      onClick={() => setLocation(crumb.path)}
                      className="flex items-center cursor-pointer hover:text-blue-600"
                    >
                      {crumb.icon && <crumb.icon className="h-4 w-4 mr-1" />}
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}