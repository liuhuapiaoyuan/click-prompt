import React from "react";
import { notFound } from "next/navigation";
import { StartlingStep } from "@/app/[lang]/chatgpt-flow/[id]/startling.type";
import StartlingStepPage from "@/app/[lang]/chatgpt-flow/[id]/StartlingStepPage";
import { getAppData } from "@/i18n";

const getSampleNames = async () => {
  const index = await import("@/assets/chatgpt/flow/index.json").then((mod) => mod.default);
  return index.map((item) => item.path.split(".").slice(0, -1).join("."));
};

async function StepDetailPage({ params }: { params: { id: string } }) {
  const { locale, pathname, i18n } = await getAppData();
  const i18nProps: GeneralI18nProps = {
    locale,
    pathname,
    i18n: {
      dict: i18n.dict,
    },
  };

  const names = await getSampleNames();
  if (!names.includes(params.id)) {
    notFound();
  }

  const content: StartlingStep = await import(`@/assets/chatgpt/flow/${params.id}.yml`).then((mod) => mod.default);

  if (!content) {
    notFound();
  }

  return <>{content && <StartlingStepPage content={content} id={params.id} i18n={i18nProps} />}</>;
}

export default StepDetailPage;
