import { defineField, defineType } from "sanity";

// vendor defined in schema but not yet used in UI — planned feature
export default defineType({
  name: "vendor",
  title: "Nhà Cung Cấp",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Tên", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" } }),
  ],
});
