import { useParams, Navigate, Link } from "react-router-dom";
import { useDocumentHead } from "../lib/head";
import { getPost, getPillar, relatedPosts } from "../lib/content";
import { CONVERSION_URL, CONVERSION_LABEL } from "../lib/site";
import { Breadcrumbs, FAQBlock, AuthorBox, ArticleCard } from "../components/blocks";

export default function ArticleDetail() {
  const { slug } = useParams();
  const post = slug ? getPost(slug) : undefined;

  useDocumentHead({
    title: post?.metaTitle ?? "Article",
    description: post?.metaDescription ?? "",
    path: `/articles/${slug}`,
    image: post ? post.featuredImage.src : undefined,
  });

  if (!post) return <Navigate to="/articles" replace />;

  const pillar = getPillar(post.pillarSlug);
  const related = relatedPosts(post);

  return (
    <>
      <article className="container-tight max-w-3xl py-12">
        <Breadcrumbs
          trail={[
            { label: "Home", to: "/" },
            ...(pillar ? [{ label: pillar.title, to: `/topics/${pillar.slug}` }] : []),
            { label: post.title },
          ]}
        />

        <header className="mt-6">
          {pillar && <p className="eyebrow">{pillar.brandLabel}</p>}
          <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">{post.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span>By {post.author}</span>
            <span aria-hidden>·</span>
            <time dateTime={post.publishedDate}>
              {new Date(post.publishedDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span aria-hidden>·</span>
            <span>{post.readingMinutes} min read</span>
          </div>
        </header>

        <img
          src={post.featuredImage.src}
          alt={post.featuredImage.alt}
          width={1200}
          height={675}
          className="mt-8 aspect-[16/9] w-full rounded-lg border border-border object-cover"
        />

        <div className="prose-article mt-8" dangerouslySetInnerHTML={{ __html: post.body }} />

        {post.faq?.length > 0 && <FAQBlock items={post.faq} />}

        <div className="my-12 rounded-lg border border-primary/30 bg-surface2 p-6 text-center sm:p-8">
          <p className="text-lg text-text">Ready to build your own Vivid Vision?</p>
          <a href={CONVERSION_URL} className="btn-cta mt-4" target="_blank" rel="noopener">
            {CONVERSION_LABEL}
          </a>
        </div>

        <AuthorBox />
      </article>

      {related.length > 0 && (
        <section className="container-tight border-t border-border py-16">
          <p className="eyebrow">Keep reading</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ArticleCard key={p.slug} post={p} />
            ))}
          </div>
          <Link to="/articles" className="mt-8 inline-block text-sm text-accent hover:text-primary">
            All articles
          </Link>
        </section>
      )}
    </>
  );
}
