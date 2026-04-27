import { ComponentType, Element } from 'react';

import { JSX } from 'react';

export interface IRoute {
  name: string;
  layout: string;

  /** optional for child routes */
  path?: string;

  /** optional for parent dropdowns */
  icon?: JSX.Element | string;

  /** dropdown children */
  items?: IRoute[];
  permission?: string;
  secondary?: boolean;
}
export interface RoutesType {
  name: string;
  layout: string;
  icon: JSX.Element | string;
  path?: string;
  secondary?: boolean;
}
