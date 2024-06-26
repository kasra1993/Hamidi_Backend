import mongoose from "mongoose";
const MaterialGradeSchema = new mongoose.Schema(
  {
    image: {
      public_id: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: false,
      },
    },
    slug: { type: String, required: false },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const materialGradeModel = mongoose.model(
  "MaterialGrades",
  MaterialGradeSchema
);
export const getMaterialGrades = () => materialGradeModel.find();

export const getMaterialGradeById = (id: string) =>
  materialGradeModel.findById(id);
// export const createMaterialGrade = (values: any) =>
//   new materialGradeModel(values).save().then((sub) => sub.toObject());
export const deleteMaterialGradeById = (id: string) =>
  materialGradeModel.findOneAndDelete({ _id: id });
export const updateMaterialGradeById = (
  id: string,
  values: Record<string, any>
) => materialGradeModel.findByIdAndUpdate(id, values);
