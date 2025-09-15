export default function slugify(input = "") {
  return input
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-가-힣]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase()
    .replace(/[가-힣]/g, "");
}
