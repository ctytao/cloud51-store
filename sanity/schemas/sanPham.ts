import { defineField, defineType } from "sanity";

export default defineType({
  name: "sanPham",
  title: "Sản Phẩm",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tên sản phẩm",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "priority",
      title: "Độ ưu tiên (Lớn hiển thị trước)",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    }),
    defineField({
      name: "image",
      title: "Ảnh sản phẩm",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "detail",
      title: "Mô tả chi tiết",
      type: "text",
    }),
    defineField({
      name: "price",
      title: "Giá (VND)",
      type: "number",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "tag",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
  ],
  orderings: [
    {
      title: "Ưu tiên (cao → thấp)",
      name: "priorityDesc",
      by: [{ field: "priority", direction: "desc" }],
    },
  ],
});
