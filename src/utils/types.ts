import { ElementHandle } from "@playwright/test";

export type language = "pt-BR" | "en" | "es";

export interface MetaTags {
  [key: string]: ElementHandle<HTMLElement | SVGElement> | null;
}

// Type definitions for the style states of elements when interacted with.
export type ElementStyleState = {
  backgroundColor: string;
  color: string;
  outerHTML: string;
};

// Type definition for the interaction styles of elements, which includes hover, focus, and active states.
export type ElementInteractionStyles = {
  hover: Array<ElementStyleState | null>;
  focus: Array<ElementStyleState | null>;
  active: Array<ElementStyleState | null>;
};
