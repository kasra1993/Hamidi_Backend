import express from "express";
var mongoose = require("mongoose");
// const fs = require("fs");
import {
  getExhibitions,
  getExhibitionById,
  updateExhibitionById,
  ExhibitionModel,
  deleteExhibitionById,
} from "../../db/exhibition";

import cloudinary from "../../utils/cloudinary";

export const getAllExhibitions = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const exhibitions = await getExhibitions();
    return res.status(200).json(exhibitions);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
export const deleteExhibition = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const deletedMaterialGrade: any = await deleteExhibitionById(id);
    if (deletedMaterialGrade.image) {
      const imgId = deletedMaterialGrade.image.public_id;
      if (imgId) {
        await cloudinary.uploader.destroy(imgId);
      }
    }

    return res.status(200).json("materialGrade got deleted").end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
export const updateExhibition = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const _id = req.params.id;
    const oldMaterialGrade: any = await ExhibitionModel.findOne({ _id });
    const updatedMaterialGrade: any = {
      // ...req.body,
      title: req.body.title ? req.body.title : oldMaterialGrade.title,
      description: req.body.description
        ? req.body.description
        : oldMaterialGrade.description,
      slug: req.body.slug ? req.body.slug : oldMaterialGrade.slug,
      materialnames: req.body.materialnames,
    };
    if (oldMaterialGrade.image !== "") {
      // const imgId = oldMaterialGrade[0].image.public_id;
      const imgId = oldMaterialGrade.image.public_id;
      if (imgId) {
        await cloudinary.uploader.destroy(imgId);
      }
      const newImg = await cloudinary.uploader.upload(req.body.image, {
        folder: "materialgrades",
      });
      updatedMaterialGrade.image = {
        public_id: newImg.public_id,
        url: newImg.secure_url,
      };
    }

    if (oldMaterialGrade) {
      Object.assign(oldMaterialGrade, updatedMaterialGrade);
    }
    const newMaterialGrade = await oldMaterialGrade!.save();
    return res.status(200).json(newMaterialGrade).end();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
export const createExhibition = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.image, {
      folder: "exhibition",
    });
    const newExhbition = new ExhibitionModel({
      ...req.body,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    await newExhbition.save();
    return res.status(200).json(newExhbition).end();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
export const getExhibition = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const product = await getExhibitionById(id);
    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
