import { defineField, defineType } from "sanity";

export default defineType({
  name: "installmentModel",
  title: "Mẫu Trả Góp (iPhone)",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Tên model (vd: 17 Pro Max)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "series",
      title: "Dòng máy (vd: 17, 16, 15...)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "minPayment",
      title: "Hỗ trợ tối thiểu (nghìn VND)",
      description: "Số tiền tối thiểu khách phải trả trước khi trả góp",
      type: "number",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "sortOrder",
      title: "Thứ tự hiển thị (nhỏ hiển thị trước)",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Thứ tự",
      name: "sortOrderAsc",
      by: [
        { field: "series", direction: "desc" },
        { field: "sortOrder", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "minPayment" },
    prepare({ title, subtitle }) {
      return {
        title: `iPhone ${title}`,
        subtitle: `Hỗ trợ: ${subtitle?.toLocaleString("vi-VN")}k VND`,
      };
    },
  },
});
