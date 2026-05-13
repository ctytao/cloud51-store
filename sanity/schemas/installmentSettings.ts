import { defineField, defineType } from "sanity";

export default defineType({
  name: "installmentSettings",
  title: "Cài đặt Trả Góp",
  type: "document",
  fields: [
    defineField({
      name: "rates",
      title: "Bảng lãi suất theo kỳ",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "period",
              title: "Số kỳ (tuần)",
              type: "number",
              validation: (r) => r.required().min(1),
            }),
            defineField({
              name: "feeRatePercent",
              title: "Phí (%)",
              description: "Tổng phí trả góp tính theo % số tiền vay (vd: 9 = 9%)",
              type: "number",
              validation: (r) => r.required().min(0),
            }),
          ],
          preview: {
            select: { period: "period", fee: "feeRatePercent" },
            prepare({ period, fee }) {
              return { title: `${period} kỳ`, subtitle: `Phí: ${fee}%` };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Cài đặt Trả Góp" };
    },
  },
});
