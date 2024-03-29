const express = require('express');
const auth = require('../middleware/auth');
const { Contact } = require('../models/Contacts');
const router = express.Router();
const validator = require('validator');

// create contact
// Auth required
router.post('/', auth, async(req, res) => {
    const name = req.body.name;
    const number = req.body.number;
    const email = req.body.email;
    const DOB = req.body.DOB ? req.body.DOB : "";
    // console.log(DOB);
    
    if(!name || !number) {
        return res.send("Name and Number cannot be empty");
    }

    try {

        if(number.length != 10) {
            return res.status(400).send('Number is Incorrect');
        }

        if(!validator.isEmail(email)) {
            return res.status(400).send('Invalid Email');
        }

        let contact = await Contact.findOne({
            $or: [
                {name: name},
                {
                    Phones : {
                    $in : [number],
                }
            }
            ]
        })

        if(contact) {
            return res.send('Contact Already Exists');
        }
        contact = new Contact({
            owner: req.user._id,
            name: name,
            Phones: [number],
            Emails: [email],
        });
    
        if(DOB != "") {
            contact.DOB = DOB
        }
    
        await contact.save();
    
        res.status(200).send(contact);
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
})

//get by email
//Auth required
router.get('/email/:x', auth, async (req, res) => {
    try {
        const email = req.params.x;
        const contacts = await Contact.find({
            owner: req.user._id,
            Emails: {
                $in : [email],
            }
        }).sort({name: "asc"});

        if(!contacts) {
            return res.send('No Contact Found');
        }

        return res.status(200).send(contacts);
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
})

//get by number
//Auth Required
router.get('/phone/:x', auth, async(req, res) => {
    try {
        const number = req.params.x;
        const contacts = await Contact.find({
            owner: req.user._id,
            Phones: {
                $in: [number]
            }
        }).sort({name: "asc"});;

        if(!contacts) {
            return res.send('No Contact Found');
        }

        return res.status(200).send(contacts);
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
    
})

//get by name
//Auth Required
router.get('/name/:x', auth, async(req, res) => {
    try {
        const name = req.params.x;
        const contacts = await Contact.find({
            owner: req.user._id,
            name: {
                $regex : name,
                $options: 'i',
            }
        }).sort({name: "asc"});;

        if(!contacts) {
            return res.send('No Contact Found');
        }

        return res.status(200).send(contacts);
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
})


//update contact by id
// Auth Required
router.patch('/:id', auth, async (req, res) => {
    try {

        const _id = req.params.id;
        const contact = await Contact.findOne({
            _id: _id,
        });

        if(!contact) {
            return res.send('No Contact Found');
        }

        if(contact.owner !== req.user) {
            return res.status(401).send('Unauthorized');
        }

        const updates = Object.keys(req.body);

        if((updates.number && updates.number.length != 10) || (updates.email && validator.isEmail(updates.email))) {
            return res.status(402).send('Invalid Updates');
        }
        updates.forEach((update) => {
            console.log(update.toString());
            if(update.toString() === "name" || update.toString() === "DOB") {
                
                contact[update] = req.body[update];
            } else if(update.toString() === "email" ){
                contact.Emails.push(req.body[update])
            } else {
                contact.Phones.push(req.body[update])
            }
        })

        await contact.save();

        res.send(contact);
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
})

// delete task by id
// Auth required
router.delete('/:id', auth, async(req, res) => {
    try {
        const _id = req.params.id;
        const contact = await Contact.findOneAndDelete({
            owner: req.user._id,
            _id: _id,
        });

        if (!contact) {
            res.status(404).send('No Contact Found');
        }
    
        res.send(contact);
    } catch(e) {
        console.log(e);
        res.status(500).send(e)
    }

})

module.exports = router;