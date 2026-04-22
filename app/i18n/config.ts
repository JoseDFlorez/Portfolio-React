import i18n, { type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import { SUPPORTED_LOCALES, type Locale } from "./locale";

import enCommon from "./locales/en/common.json";
import enMeta from "./locales/en/meta.json";
import enHome from "./locales/en/home.json";
import enAbout from "./locales/en/about.json";
import enProjects from "./locales/en/projects.json";
import enContact from "./locales/en/contact.json";

import esCommon from "./locales/es/common.json";
import esMeta from "./locales/es/meta.json";
import esHome from "./locales/es/home.json";
import esAbout from "./locales/es/about.json";
import esProjects from "./locales/es/projects.json";
import esContact from "./locales/es/contact.json";

export const NAMESPACES = [
  "common",
  "meta",
  "home",
  "about",
  "projects",
  "contact",
] as const;

const resources = {
  en: {
    common: enCommon,
    meta: enMeta,
    home: enHome,
    about: enAbout,
    projects: enProjects,
    contact: enContact,
  },
  es: {
    common: esCommon,
    meta: esMeta,
    home: esHome,
    about: esAbout,
    projects: esProjects,
    contact: esContact,
  },
} as const;

export function createI18nInstance(locale: Locale): I18nInstance {
  const instance = i18n.createInstance();
  instance.use(initReactI18next).init({
    lng: locale,
    fallbackLng: "en",
    supportedLngs: [...SUPPORTED_LOCALES],
    ns: [...NAMESPACES],
    defaultNS: "common",
    resources,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    returnNull: false,
  });
  return instance;
}

export type I18nResources = typeof resources.en;
