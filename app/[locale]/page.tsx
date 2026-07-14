import { getTranslations } from "next-intl/server";
import Hero from "@/components/home/Hero";
import PartSelector from "@/components/home/PartSelector";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return { title: `RotorStator — ${t("headline")}` };
}

export default function HomePage() {
  return (
    <div>
      <Hero />
      <PartSelector />
    </div>
  );
}
