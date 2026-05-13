// @ts-nocheck
// このファイルで事前にページを作る指示を出します
export async function generateStaticParams() {
  return [{ word: 'hello' }];
}

export default function WordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
