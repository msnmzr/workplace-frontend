import * as Icons from "../icons";

export interface NavItem {
  title: string;
  url?: string;
  icon: any;
  items: NavItem[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const NAV_DATA: NavSection[] = [
  {
    label: "",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Icons.HomeIcon,
        items: [],
      },
      {
        title: "Users",
        url: "/admin/users",
        icon: Icons.User, // Using generic User icon, or could find a specific one
        items: [],
      },
      {
        title: "Roles",
        url: "/admin/roles",
        icon: Icons.UserGroup, // Using Authentication icon as placeholder for Roles
        items: [],
      },
      {
        title: "Permissions",
        url: "/admin/permissions",
        icon: Icons.Permissions, // Using Alphabet/Text icon for permissions
        items: [],
      },
      {
        title: "Applications",
        url: "/admin/applications",
        icon: Icons.RectangleStack, // Using PieChart icon as placeholder
        items: [],
      },
      {
        title: "News",
        url: "/admin/news",
        icon: Icons.News,
        items: [],
      },
    ],
  },
  {
    label: "",
    items: [
      {
        title: "Settings",
        url: "/admin/settings",
        icon: Icons.Setting,
        items: [
          {
            title: "Pages",
            url: "/admin/settings/pages",
            icon: Icons.Setting,
            items: [],
          },
          {
            title: "Menus",
            url: "/admin/settings/menus",
            icon: Icons.Setting,
            items: [],
          }
        ],
      }
    ]
  }
];
