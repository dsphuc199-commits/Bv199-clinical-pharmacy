import {
  foundationsModule,
} from "./foundations";

export const pkpdModules = [
  foundationsModule,
];

export function getPKPDModule(
  slug: string
) {
  return pkpdModules.find(
    (module) =>
      module.slug === slug
  );
}