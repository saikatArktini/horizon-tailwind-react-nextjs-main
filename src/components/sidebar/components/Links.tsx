// /* eslint-disable */
'use client';

import React, { useCallback, useState } from 'react';
import { usePathname } from 'next/navigation';
import NavLink from 'components/link/NavLink';
import DashIcon from 'components/icons/DashIcon';
import { IRoute } from 'types/navigation';
import { MdKeyboardArrowDown } from 'react-icons/md';
import {jwtDecode} from 'jwt-decode';

type TokenPayload = {
  permissions?: string[];
};

export const SidebarLinks = ({ routes }: { routes: IRoute[] }): JSX.Element => {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  /* =======================
     🔐 READ USER PERMISSIONS
     ======================= */
  let permissions: string[] = [];
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        permissions = decoded.permissions ?? [];
      } catch {
        permissions = [];
      }
    }
  }

  /* =======================
     🔹 FILTER ROUTES
     ======================= */
  const filteredRoutes: IRoute[] = routes
    .map((route) => {
      // If route has children, filter children
      if (route.items && route.items.length > 0) {
        const allowedItems = route.items.filter((item) => {
          if (!item.permission) return true;
          return permissions.includes(item.permission);
        });

        // Hide parent if no child left
        if (allowedItems.length === 0) return null;

        return { ...route, items: allowedItems };
      }

      // Single route permission check
      if (route.permission) {
        return permissions.includes(route.permission) ? route : null;
      }

      return route;
    })
    .filter(Boolean) as IRoute[];

  /* 🔹 Active route check */
  const isActive = useCallback(
    (path?: string) => {
      if (!path) return false;
      return pathname?.includes(path);
    },
    [pathname]
  );

  /* 🔹 Toggle dropdown */
  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const renderRoute = (route: IRoute, index: number) => {
    const hasChildren = Array.isArray(route.items) && route.items.length > 0;
    const isParentActive =
      hasChildren &&
      route.items!.some((child) => isActive(child.path));

    /* =======================
       🔹 DROPDOWN PARENT
       ======================= */
    if (hasChildren) {
      return (
        <div key={index} className="mb-2">
          <div
            onClick={() => toggleMenu(route.name)}
            className={`flex cursor-pointer items-center px-8 py-2 transition-all ${
              isParentActive
                ? 'font-bold text-navy-700 dark:text-white'
                : 'font-medium text-gray-600'
            }`}
          >
            <span className="mr-4">
              {route.icon ? route.icon : <DashIcon />}
            </span>

            <span className="flex-1">{route.name}</span>

            <MdKeyboardArrowDown
              className={`transition-transform ${
                openMenus[route.name] ? 'rotate-180' : ''
              }`}
            />
          </div>

          {/* 🔹 CHILD LINKS */}
          {openMenus[route.name] && (
            <ul className="ml-10 mt-1 space-y-1">
              {route.items!.map((child, idx) => (
                <NavLink
                  key={idx}
                  href={`${child.layout}${child.path}`}
                >
                  <li
                    className={`cursor-pointer rounded px-4 py-2 text-sm ${
                      isActive(child.path)
                        ? 'font-bold text-brand-500'
                        : 'text-gray-600'
                    }`}
                  >
                    {child.name}
                  </li>
                </NavLink>
              ))}
            </ul>
          )}
        </div>
      );
    }

    /* =======================
       🔹 NORMAL LINK
       ======================= */
    return (
      <NavLink key={index} href={`${route.layout}${route.path}`}>
        <div className="relative mb-3 flex hover:cursor-pointer">
          <li className="my-[3px] flex cursor-pointer items-center px-8">
            <span
              className={`${
                isActive(route.path)
                  ? 'font-bold text-brand-500 dark:text-white'
                  : 'font-medium text-gray-600'
              }`}
            >
              {route.icon ? route.icon : <DashIcon />}
            </span>

            <p
              className={`ml-4 flex ${
                isActive(route.path)
                  ? 'font-bold text-navy-700 dark:text-white'
                  : 'font-medium text-gray-600'
              }`}
            >
              {route.name}
            </p>
          </li>

          {isActive(route.path) && (
            <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
          )}
        </div>
      </NavLink>
    );
  };

  /* ✅ ONLY THIS LINE CHANGED */
  return <>{filteredRoutes.map(renderRoute)}</>;
};

export default SidebarLinks;
