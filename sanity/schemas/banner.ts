import { defineField, defineType } from "sanity";

export default defineType({
  name: "banner",
  title: "Banner",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Tiêu đề", type: "string" }),
    defineField({ name: "image", title: "Ảnh", type: "image", validation: (r) => r.required() }),
    defineField({ name: "url", title: "URL liên kết", type: "string" }),
    defineField({ name: "isActive", title: "Hiển thị", type: "boolean", initialValue: true }),
  ],
});
