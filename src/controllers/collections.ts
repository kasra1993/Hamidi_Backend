import express from "express";
import { PartProviderModel } from "../db/parts/partProviders";
import {
  MaterialProviderModel,
  getMaterialProviders,
} from "../db/materials/materialProviders";
import { getMaterialGroups } from "../db/materials/materialGroups";
import { getMaterialGrades } from "../db/materials/materialGrades";
import { getMaterialNames } from "../db/materials/materialNames";

// export const getAllParts = () =>
//   partGroupModel.find().populate({
//     path: "partnames",
//     populate: {
//       path: "partgeneralids",
//       populate: {
//         path: "partproviders",
//         model: "PartProviders",
//       },
//     },
//   });
// export const getAllMaterials = () =>
//   materialGroupModel.find().populate({
//     path: "materialnames",
//     populate: {
//       path: "materialgrades",
//       populate: {
//         path: "materialproviders",
//       },
//     },
//   });
// export const getAllMaterialProviders = () =>
//   MaterialProviderModel.find()
//     .populate("records.materialgroup")
//     .populate("records.materialname")
//     .populate("records.materialgrade");
export const getAllPartProviders = () =>
  PartProviderModel.find()
    .populate({ path: "partgeneralids", select: "title" })
    .populate({ path: "partnames", select: "title" })
    .populate({ path: "partgroups", select: "title" });

export const getAll = async (req: express.Request, res: express.Response) => {
  try {
    const materialGroups = await getMaterialGroups();
    const materialNames = await getMaterialNames();
    const materialGrades = await getMaterialGrades();
    const materialProviders = await getMaterialProviders();
    const partProviders = await getAllPartProviders();
    const allArray = {
      materialProviders,
      partProviders,
      materialGrades,
      materialGroups,
      materialNames,
    };

    console.log(materialProviders[0].records, "materialProviders");

    // return res.status(200).json(collections);
    return res.status(200).json(allArray);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};