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
import clsx from 'clsx';

interface Crumb {
  label: string;
  path: string;
  icon?: typeof Home | null;
}

export default function BreadcrumbNav() {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();

  // Do not show breadcrumbs on auth or home page
  if (location === ROUTES.AUTH || location === ROUTES.HOME) {
    return null;
  }

  const currentRoute = ROUTE_CONFIG[location as keyof typeof ROUTE_CONFIG];

  if (!currentRoute) {
    return null;
  }

  const breadcrumbs: Crumb[] = [
    {
      label: t('breadcrumb.dashboard', 'Dashboard'),
      path: ROUTES.DASHBOARD,
      icon: Home,
    },
  ];


  // Add current page if it's not dashboard
  if (location !== ROUTES.DASHBOARD) {
    breadcrumbs.push({
      label: t(
        `breadcrumb.${currentRoute.title.toLowerCase()}`,
        currentRoute.title,
      ),
      path: location,
      icon: null,
    });
  }

  return (
    <nav
      className="bg-background border-b border-border px-3 py-2 sm:px-6 sm:py-3 w-full"
      aria-label="Breadcrumb navigation"
      role="navigation"
    >
      <div className="max-w-7xl mx-auto">
        <Breadcrumb>
          <BreadcrumbList className="flex-wrap">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <BreadcrumbItem
                  key={crumb.path}
                  className={clsx(
                    'inline-flex items-center min-w-0',
                    // Responsive max-widths for better truncation
                    isLast
                      ? 'max-w-[200px] sm:max-w-[300px] md:max-w-[400px]'
                      : 'max-w-[150px] sm:max-w-[200px] md:max-w-[250px]'
                  )}
                >
                  {index > 0 && (
                    <BreadcrumbSeparator className="text-muted-foreground/60" />
                  )}
                  {isLast ? (
                    <BreadcrumbPage
                      className={clsx(
                        'flex items-center gap-1.5 font-medium text-foreground',
                        'truncate min-w-0',
                        'aria-[current=page]:text-primary'
                      )}
                      aria-current="page"
                      title={crumb.label}
                    >
                      {crumb.icon && (
                        <crumb.icon
                          className="h-4 w-4 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                      )}
                      <span className="truncate" title={crumb.label}>
                        {crumb.label}
                      </span>
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      onClick={() => setLocation(crumb.path)}
                      className={clsx(
                        'flex items-center gap-1.5 cursor-pointer transition-colors',
                        'text-muted-foreground hover:text-foreground',
                        'truncate min-w-0',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        'rounded-sm px-1 py-0.5 -mx-1 -my-0.5'
                      )}
                      tabIndex={0}
                      aria-label={`Navigate to ${crumb.label}`}
                      title={crumb.label}
                    >
                      {crumb.icon && (
                        <crumb.icon
                          className="h-4 w-4 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      <span className="truncate">{crumb.label}</span>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </nav>
  );
}
