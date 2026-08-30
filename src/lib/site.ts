import {
  contactDetails,
  exploreNavigation,
  footerNavigation as contentFooterNavigation,
  primaryNavigation as contentPrimaryNavigation,
  siteConfig as contentSiteConfig,
  socialLinks,
} from "@/data/site";

const facebook = socialLinks.find((item) => item.platform === "Facebook");
const instagram = socialLinks.find((item) => item.platform === "Instagram");

export const siteConfig = {
  ...contentSiteConfig,
  tagline: "Curiosity into discovery",
  college: contentSiteConfig.institution,
  address: contactDetails.addressLines.join(", "),
  email: contactDetails.email,
  phone: contactDetails.phone,
  officeHours: contactDetails.officeHours,
  social: {
    facebook: facebook?.href ?? "#",
    instagram: instagram?.href ?? "#",
  },
} as const;

const coreNavigation = contentPrimaryNavigation.filter((item) => !item.highlighted);

export const primaryNavigation = [
  ...coreNavigation.slice(0, 4),
  ...exploreNavigation,
  ...coreNavigation.slice(4),
] as const;

export const footerNavigation = {
  explore: contentFooterNavigation[0].links,
  club: [...contentFooterNavigation[1].links, ...contentFooterNavigation[2].links],
} as const;

export function absoluteUrl(path = "") {
  return `${siteConfig.url}${path}`;
}
