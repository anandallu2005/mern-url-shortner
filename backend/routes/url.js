import express from 'express';
import Url from '../models/url.js';
import {nanoid} from 'nanoid';

const router=express.Router();
router.post('/shorten',async(req,res)=>{
    try{
        const {originalUrl}=req.body;
        if (!originalUrl){
            return res.status(400).json({error:"Url is required"});
        }
        try{
          new URL(originalUrl);
        }catch{
           return res.status(400).json("url is invalid");
        }
        let shortId;
        let exists=true;
        while(exists){
            shortId=nanoid(7);
            exists=await Url.findOne({shortId});
        }
        const url=await Url.create({
             shortId,originalUrl
        });
        res.json({
            shortId:url.shortId,
            shortUrl:`${process.env.BASE_URL}/${shortId}`,
        })
    }catch(error){
        console.log(error);
        res.status(500).json({error:"server error"})
    }
})

router.get("/:shortId",async(req,res)=>{
    try{
        const {shortId}=req.params;
        const url=await Url.findOne({shortId});
        if(!url) return res.status(400).json({error:"url not found"});

        url.clicks+=1;
        await url.save();

        return res.redirect(url.originalUrl);
    }catch(error){
        console.log(error);
        res.status(500).json({error:"server error"});

    }
});
export default router;

