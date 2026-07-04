export type NavItem = {
  title: string;
  href: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const nav: NavGroup[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/" },
      { title: "Installation", href: "/installation" },
      { title: "Quickstart", href: "/quickstart" },
      { title: "CLI options", href: "/cli-options" },
      { title: "Project structure", href: "/project-structure" },
    ],
  },
  {
    title: "Your stack",
    items: [
      { title: "Database", href: "/database" },
      { title: "ORM", href: "/orm" },
      { title: "Authentication", href: "/authentication" },
      { title: "API layer", href: "/api" },
      { title: "Payments", href: "/payments" },
      { title: "Email", href: "/email" },
      { title: "Analytics", href: "/analytics" },
      { title: "Styling & UI", href: "/styling" },
    ],
  },
  {
    title: "Reference",
    items: [
      { title: "Changelog", href: "/changelog" },
      { title: "FAQ", href: "/faq" },
      { title: "Contributing", href: "/contributing" },
    ],
  },
];

// Flattened, ordered list used for prev/next page navigation.
export const flatNav: NavItem[] = nav.flatMap(group => group.items);

export function getAdjacent(pathname: string): {
  prev: NavItem | null;
  next: NavItem | null;
} {
  const index = flatNav.findIndex(item => item.href === pathname);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? flatNav[index - 1] : null,
    next: index < flatNav.length - 1 ? flatNav[index + 1] : null,
  };
}
