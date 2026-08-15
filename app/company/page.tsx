import type { Metadata } from "next";
import { CompanyPageView } from "@/components/marketing/company-page-view";
import { JsonLd } from "@/components/marketing/json-ld";
import { companyFaqItems } from "@/lib/marketing/faq";
import {
  breadcrumbSchema,
  faqPageSchema,
  graph,
  softwareApplicationSchema,
  webPageSchema,
} from "@/lib/seo/structured-data";

const PATH = "/company";
const TITLE = "Company workspaces";
const DESCRIPTION =
  "One shared Grant context workspace every member's agents can use, with roles, section permissions, an activity view, and admin controls.";
const DATE_MODIFIED = "2026-07-07";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
};

export default function CompanyPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema({
            path: PATH,
            name: "Grant company workspaces",
            description: DESCRIPTION,
            dateModified: DATE_MODIFIED,
          }),
          breadcrumbSchema(PATH, [
            { name: "Grant", path: "/home" },
            { name: "Company", path: PATH },
          ]),
          softwareApplicationSchema(),
          faqPageSchema(companyFaqItems)
        )}
      />
      <CompanyPageView />
    </>
  );
}
