const messageModel = require("../models/messageModel");

module.exports.addMessage = async(req,res,next)=>{
    try {
        const {from,to,message} = req.body
        const data = await messageModel.create({
            message: {text:message},
            users: [from,to],
            sender: from
        })
        if(data)return res.json({msg: 'message sent successfully!'})
        return res.json({msg: 'Failed to send the message!'})
    } catch (error) {
        next(error);
    }

}

module.exports.getAllMessages = async(req,res,next)=>{
    try {
        const {from,to} = req.body;
        const messages = await messageModel.find({
            users:{
                $all: [from,to],
            }
        }).sort(
            {updatedAt: 1}
        );
        const projectMessages =  messages.map((msg)=>{
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text
            }
        })
        // if(projectMessages)return res.json(projectMessages)
        // return res.json({msg: "Error displaying messages!"})
        return res.json(projectMessages)
    } catch (error) {
        next(error);
    }

}