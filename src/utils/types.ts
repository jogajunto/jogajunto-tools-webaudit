import { ElementHandle } from '@playwright/test';

export type language = 'pt-BR' | 'en' | 'es';

export interface MetaTags {
  [key: string]: ElementHandle<HTMLElement | SVGElement> | null;
}
