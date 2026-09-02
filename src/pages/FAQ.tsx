import { useDocumentHead } from "../lib/head";
import { FAQ as FAQ_ITEMS } from "../lib/content";
import { FAQBlock, CTABand } from "../components/blocks";

export default function FAQ() {
  useDocumentHead({
    title: "Vivid Vision FAQ",
    description:
      "Common questions about Vivid Vision: what it is, how it differs from a business plan or vision board, why three years, how the rollout works, and how to start.",
    path: "/faq",
  });

  return (
    <>
      <div className="container-tight max-w-3xl py-16">
        <p className="eyebrow">FAQ</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Questions about Vivid Vision</h1>
        <FAQBlock items={FAQ_ITEMS} heading="" />
      </div>
      <CTABand />
    </>
  );
}
