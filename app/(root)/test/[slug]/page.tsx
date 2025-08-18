export default function Test({ params }: { params: { slug: string } }) {
  return <h1>Slug is: {params.slug}</h1>;
}
