const express = require("express");
const { authAdmin } = require("../middlewares/auth");
const { validateProduct, ProductModel } = require("../models/productModel");
const router = express.Router();
const { random } = require("lodash")


router.get("/", async (req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page >= 1 ? req.query.page - 1 : 0;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    let cat = req.query.cat || null
    try {
        objFind = (cat) ? { cat_short_id: cat } : {}
        let data = await ProductModel.find({ objFind })
            .limit(perPage)
            .skip(page * perPage)
            .sort({ [sort]: reverse })
        res.json(data)
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }

})

router.get("/search", async (req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page >= 1 ? req.query.page - 1 : 0;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    let serachQ = req.query.s;
    try {
        let searchReg = new RegExp(serachQ, "i")
        let data = await ProductModel.find({ $or: [{ name: searchReg }, { info: searchReg }] })
            .limit(perPage)
            .skip(page * perPage)
            .sort({ [sort]: reverse })
        res.json(data)
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }

})

router.get("/single/:id", async (req, res) => {
    try {
        let id = req.params.id
        let data = await ProductModel.findOne({ _id: id })
        res.json(data);
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)

    }

})

router.post("/", authAdmin, async (req, res) => {
    let validBody = validateProduct(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let product = new ProductModel(req.body);
        product.user_id = req.tokenData._id;
        product.short_id = await genShortId();
        await product.save()
        res.status(201).json(product);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
})

router.put("/:idEdit", authAdmin, async (req, res) => {
    let validBody = validateProduct(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let idEdit = req.params.idEdit
        let data = await ProductModel.updateOne({ _id: idEdit }, req.body);
        res.status(201).json(data)
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
})

router.delete("/:idDel", authAdmin, async (req, res) => {

    try {
        let idDel = req.params.idDel;
        let data = await ProductModel.deleteOne({ _id: idDel }, req.body);
        res.status(201).json(data)
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
})
const genShortId = async () => {
    let flag = true; // will become false if not found short_id = rnd
    // check if there no category with rnd = short_id;
    let rnd;
    while (flag) {
        rnd = random(0, 999999)
        try {
            let data = await ProductModel.findOne({ short_id: rnd })
            if (!data) {
                flag = false;
            }
        }
        catch (err) {
            console.log(err);
            flag = false;
            return res.status(500).json(err);
        }
    }
    return rnd;
}



module.exports = router;